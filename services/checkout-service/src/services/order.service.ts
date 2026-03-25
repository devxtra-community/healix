import axios from 'axios';
import { env } from '../config/env.js';
import { OrderRespository } from '../repositories/order.repository.js';
import { RefundService } from './refund.service.js';
import { PaymentRepository } from '../repositories/payment.repository.js';
import { stripe } from '../config/stripe.js';

type FulfillmentStatus =
  | 'PLACED'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';
export class OrderService {
  constructor(
    private orderRepo: OrderRespository,
    private refundService: RefundService,
    private paymentRepo: PaymentRepository,
  ) {}
  getuserOrder(userId: string) {
    return this.orderRepo.getUserOrders(userId);
  }
  getOrder(orderId: string) {
    return this.orderRepo.getOrder(orderId);
  }
  getAllorders() {
    return this.orderRepo.getAllOrders();
  }
  updateFullfillmentStatus(orderId: string, status: FulfillmentStatus) {
    return this.orderRepo.updateFulfillmentStatus(orderId, status);
  }

  async markPaid(orderId: string) {
    await this.orderRepo.updatePaymentStatus(orderId, 'SUCCESS');
  }

  async markPaymentFailed(orderId: string) {
    await this.orderRepo.updatePaymentStatus(orderId, 'FAILED');
  }
  async markFailed(orderId: string) {
    await this.orderRepo.updatePaymentStatus(orderId, 'FAILED');
  }
  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderRepo.getOrder(orderId);
    if (!order || order.userId !== userId) {
      throw new Error('Order not found');
    }

    try {
      await this.orderRepo.cancelOrder(orderId);
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.name === 'ConditionalCheckFailedException'
      ) {
        return { status: 'PROCESSING' as const };
      }
      throw err;
    }

    if (order.paymentStatus !== 'SUCCESS') {
      await this.orderRepo.updatePaymentStatus(orderId, 'FAILED');
    }

    // Only release reserved stock when the order was never paid.
    // For PENDING/FAILED orders, stock is still in the `reserved` bucket
    // and must be returned to `available`.
    //
    // For SUCCESS orders (Stripe), stock was already moved through
    // confirmStock() which decremented `reserved` and `total` — there is
    // nothing left in `reserved` to release. Instead we trigger a refund.
    if (order.paymentStatus !== 'SUCCESS') {
      await Promise.allSettled(
        order.items.map((item) =>
          axios.post(`${env.productServiceUrl}/product/stocks/release`, {
            versionId: item.variantId,
            quantity: item.quantity,
          }),
        ),
      );
    }

    if (order.paymentStatus === 'SUCCESS' && order.paymentId) {
      await this.refundService.createRefund(order);
    }

    return { status: 'PROCESSING' as const };
  }

  async getStripeClientSecretForOrder(orderId: string, userId: string) {
    const order = await this.orderRepo.getOrder(orderId);
    if (!order || order.userId !== userId) {
      throw new Error('Order not found');
    }

    if (order.paymentStatus === 'SUCCESS') {
      throw new Error('Order already paid');
    }

    if (order.fulfillmentStatus === 'CANCELLED') {
      throw new Error('Cancelled orders cannot be paid');
    }

    if (order.paymentMethod && order.paymentMethod !== 'STRIPE') {
      throw new Error('This order is not configured for Stripe payment');
    }

    const payment = await this.paymentRepo.getByOrder(orderId);
    if (!payment || !payment.stripePaymentIntentId) {
      throw new Error('Stripe payment is not available for this order');
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment.stripePaymentIntentId,
    );

    if (!paymentIntent.client_secret) {
      throw new Error('Unable to initialize Stripe payment');
    }

    return {
      orderId: order.orderId,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async syncStripePaymentStatus(orderId: string, userId: string) {
    const order = await this.orderRepo.getOrder(orderId);
    if (!order || order.userId !== userId) {
      throw new Error('Order not found');
    }

    if (order.paymentMethod && order.paymentMethod !== 'STRIPE') {
      throw new Error('This order does not use Stripe payment');
    }

    if (order.paymentStatus === 'SUCCESS') {
      return { orderId, paymentStatus: 'SUCCESS' as const };
    }

    const payment = await this.paymentRepo.getByOrder(orderId);
    if (!payment?.stripePaymentIntentId) {
      throw new Error('Stripe payment is not available for this order');
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment.stripePaymentIntentId,
    );

    if (paymentIntent.status === 'succeeded') {
      await this.paymentRepo.updateStatus(
        orderId,
        payment.paymentId,
        'SUCCESS',
      );
      await this.orderRepo.updatePaymentStatus(orderId, 'SUCCESS');
      return { orderId, paymentStatus: 'SUCCESS' as const };
    }

    if (paymentIntent.status === 'canceled') {
      await this.paymentRepo.updateStatus(orderId, payment.paymentId, 'FAILED');
      await this.orderRepo.updatePaymentStatus(orderId, 'FAILED');
      return { orderId, paymentStatus: 'FAILED' as const };
    }

    return { orderId, paymentStatus: 'PENDING' as const };
  }
}
