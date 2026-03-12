import axios from 'axios';
import Stripe from 'stripe';
import { v4 as uuid } from 'uuid';
import { AnalyticsService } from '../analytics/analytics.service.js';
import { env } from '../config/env.js';
import { stripe } from '../config/stripe.js';
import { Order } from '../domain/order.type.js';
import { cartRepository } from '../repositories/cart.repository.factory.js';
import { DynamoOrderRepository } from '../repositories/order.repository.dynamo.js';
import { DynamoPaymentRepository } from '../repositories/payment.repository.dynamo.js';
import { Payment } from '../domain/payment.types.js';
import { PaymentService } from './payment.service.js';
import { publishEvent } from './rabbitmq.service.js';
import { generateOrderNumber } from '../utils/order-number.js';

type CheckoutResult = {
  status: 'PROCESSING';
  message?: string;
  orderId?: string;
};

type StripeSessionResult = {
  status: 'PROCESSING';
  sessionUrl: string;
  sessionId: string;
};

type StripeVerificationResult = {
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  orderId?: string;
  sessionId: string;
};

export class CheckoutService {
  private readonly orderRepository = new DynamoOrderRepository();
  private readonly paymentService = new PaymentService(
    new DynamoPaymentRepository(),
  );
  private readonly analyticsService = new AnalyticsService();

  async checkOut(
    userId: string,
    addressId: string,
    paymentMethod: 'STRIPE' | 'COD' = 'STRIPE',
  ): Promise<CheckoutResult> {
    if (paymentMethod === 'STRIPE') {
      throw new Error('Use the Stripe session endpoint for Stripe payments');
    }

    const orderDraft = await this.buildOrderDraft(userId, addressId, 'COD');
    await this.reserveDraftStock(orderDraft);
    await this.orderRepository.createOrder(orderDraft);

    const payment = await this.paymentService.createPendingPayment(
      orderDraft.orderId,
      userId,
      orderDraft.totalAmount,
      orderDraft.currency,
      'COD',
      undefined,
    );

    await this.orderRepository.updatePaymentId(
      orderDraft.orderId,
      payment.paymentId,
    );

    const stockItems = orderDraft.items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    await publishEvent('order.created', {
      orderId: orderDraft.orderId,
      userId: orderDraft.userId,
      items: stockItems,
    });

    await cartRepository.clearCart(userId);

    return {
      status: 'PROCESSING',
      orderId: orderDraft.orderId,
    };
  }

  async createStripeSession(
    userId: string,
    addressId: string,
  ): Promise<StripeSessionResult> {
    const orderDraft = await this.buildOrderDraft(userId, addressId, 'STRIPE');

    await this.reserveDraftStock(orderDraft);

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${env.frontendUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.frontendUrl}/checkout`,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        line_items: orderDraft.items.map((item) => ({
          price_data: {
            currency: orderDraft.currency.toLowerCase(),
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : undefined,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        metadata: {
          orderId: orderDraft.orderId,
          userId,
        },
      });

      if (!session.url) {
        throw new Error('Stripe session URL missing');
      }

      await this.paymentService.createPendingPayment(
        orderDraft.orderId,
        userId,
        orderDraft.totalAmount,
        orderDraft.currency,
        'STRIPE',
        undefined,
        {
          stripeCheckoutSessionId: session.id,
          checkoutDraft: orderDraft,
          stockReserved: true,
        },
      );

      return {
        status: 'PROCESSING',
        sessionUrl: session.url,
        sessionId: session.id,
      };
    } catch (error) {
      await this.releaseDraftStock(orderDraft);
      throw error;
    }
  }

  async verifyStripeSession(
    userId: string,
    sessionId: string,
  ): Promise<StripeVerificationResult> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.metadata?.userId || session.metadata.userId !== userId) {
      throw new Error('Unauthorized Stripe session');
    }

    if (session.payment_status === 'paid') {
      const order = await this.finalizeStripeSession(session);
      return {
        status: 'SUCCESS',
        orderId: order.orderId,
        sessionId,
      };
    }

    if (session.status === 'expired') {
      await this.releaseStripeSession(sessionId);
      return {
        status: 'FAILED',
        sessionId,
      };
    }

    return {
      status: 'PENDING',
      sessionId,
    };
  }

  async handleCompletedStripeSession(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return null;
    }

    return this.finalizeStripeSession(session);
  }

  async releaseStripeSession(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const payment = await this.resolvePaymentForSession(session);
    if (!payment) {
      return null;
    }

    if (payment.status === 'FAILED') {
      return payment;
    }

    if (payment.checkoutDraft && payment.stockReserved) {
      await this.releaseDraftStock(payment.checkoutDraft);
    }

    if (payment.stripeCheckoutSessionId === sessionId) {
      await this.paymentService.markFailedBySession(sessionId);
    } else {
      await this.paymentService.markFailedByOrder(payment.orderId);
    }
    return payment;
  }

  private async finalizeStripeSession(session: Stripe.Checkout.Session) {
    const payment = await this.resolvePaymentForSession(session);
    if (!payment) {
      throw new Error(`Payment not found for Stripe session ${session.id}`);
    }

    const existingOrder = await this.orderRepository.getOrder(payment.orderId);
    if (existingOrder) {
      return existingOrder;
    }

    if (!payment.checkoutDraft) {
      throw new Error(
        `Checkout draft missing for payment ${payment.paymentId}`,
      );
    }

    if (payment.stockReserved) {
      await this.confirmDraftStock(payment.checkoutDraft);
    } else {
      await this.reserveDraftStock(payment.checkoutDraft);
      await this.confirmDraftStock(payment.checkoutDraft);
    }

    if (payment.stripeCheckoutSessionId === session.id) {
      await this.paymentService.markSuccessBySession(session.id);
    } else {
      await this.paymentService.markSuccessByOrder(payment.orderId);
    }

    const order: Order = {
      ...payment.checkoutDraft,
      paymentId: payment.paymentId,
      paymentMethod: 'STRIPE',
      paymentStatus: 'SUCCESS',
      updatedAt: new Date().toISOString(),
    };

    await this.orderRepository.createOrder(order);

    try {
      await publishEvent('order.created', {
        orderId: order.orderId,
        userId: order.userId,
        items: order.items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });
    } catch (error) {
      console.error(
        'Failed to publish order.created after Stripe success',
        error,
      );
    }

    try {
      await cartRepository.clearCart(order.userId);
    } catch (error) {
      console.error('Failed to clear cart after Stripe success', error);
    }

    return order;
  }

  private async resolvePaymentForSession(session: Stripe.Checkout.Session) {
    const paymentBySession = await this.paymentService.getByCheckoutSessionId(
      session.id,
    );
    if (paymentBySession) {
      return paymentBySession;
    }

    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return null;
    }

    return this.paymentService.getByOrder(orderId);
  }

  private async buildOrderDraft(
    userId: string,
    addressId: string,
    paymentMethod: Payment['method'],
  ): Promise<Order> {
    await this.analyticsService.trackCheckoutStarted();

    const cart = await cartRepository.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const addressRes = await axios.get(
      `${env.userServiceUrl}/address/${addressId}`,
      { headers: { 'x-user-id': userId } },
    );
    const addressSnapshot = addressRes.data?.data ?? addressRes.data;

    const availableItems = [];

    for (const item of cart.items) {
      const stockRes = await axios.get(
        `${env.productServiceUrl}/product/stocks/${item.variantId}`,
      );

      if (!stockRes.data || stockRes.data.available < item.quantity) {
        throw new Error('Some items are unavailable. Remove them to continue.');
      }

      availableItems.push(item);
    }

    const now = new Date().toISOString();
    const orderId = `ORD-${uuid()}`;
    const orderNumber = await generateOrderNumber();

    let subtotal = 0;
    const orderItems: Order['items'] = [];

    for (const item of availableItems) {
      const priceRes = await axios.get(
        `${env.productServiceUrl}/product/price/${item.productId}`,
      );

      const finalPrice = priceRes.data?.finalPrice ?? priceRes.data?.finalprice;
      const price = Number(finalPrice);

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(`Invalid price for product ${item.productId}`);
      }

      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price,
        subtotal: itemSubtotal,
        attributes: item.attributes,
      });
    }

    return {
      orderId,
      orderNumber,
      userId,
      addressSnapshot,
      items: orderItems,
      subtotal,
      totalAmount: subtotal,
      currency: 'INR',
      paymentMethod,
      paymentStatus: paymentMethod === 'STRIPE' ? 'PENDING' : 'PENDING',
      fulfillmentStatus: 'PLACED',
      createdAt: now,
      updatedAt: now,
    };
  }

  private async reserveDraftStock(order: Order) {
    const reservedItems: Array<{ versionId: string; quantity: number }> = [];

    try {
      for (const item of order.items) {
        const payload = {
          versionId: item.variantId,
          quantity: item.quantity,
        };

        await axios.post(
          `${env.productServiceUrl}/product/stocks/reserve`,
          payload,
        );
        reservedItems.push(payload);
      }
    } catch (error) {
      await Promise.allSettled(
        reservedItems.map((item) =>
          axios.post(`${env.productServiceUrl}/product/stocks/release`, item),
        ),
      );
      throw error;
    }
  }

  private async confirmDraftStock(order: Order) {
    for (const item of order.items) {
      await axios.post(`${env.productServiceUrl}/product/stocks/confirm`, {
        versionId: item.variantId,
        quantity: item.quantity,
      });
    }
  }

  private async releaseDraftStock(order: Order) {
    await Promise.allSettled(
      order.items.map((item) =>
        axios.post(`${env.productServiceUrl}/product/stocks/release`, {
          versionId: item.variantId,
          quantity: item.quantity,
        }),
      ),
    );
  }
}
