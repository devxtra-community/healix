import { OrderRespository } from '../repositories/order.repository.js';
import { RefundService } from './refund.service.js';
import axios from 'axios';
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
        // idempotent cancel → silently succeed
        return;
      }
      throw err;
    }

    // RELEASE STOCK
    for (const item of order.items) {
      await axios.post(
        `${process.env.PRODUCT_SERVICE_URL}/product/stocks/release`,
        item,
      );
    }

    // REFUND ONLY IF PAID
    if (order.paymentStatus === 'SUCCESS' && order.paymentId) {
      await this.refundService.createRefund(order);
    }
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
