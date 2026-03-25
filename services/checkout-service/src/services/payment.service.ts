import { v4 as uuid } from 'uuid';
import { PaymentRepository } from '../repositories/payment.repository.js';
import { Payment } from '../domain/payment.types.js';
import { Order } from '../domain/order.type.js';

export class PaymentService {
  constructor(private paymentRepo: PaymentRepository) {}

  async createPendingPayment(
    orderId: string,
    userId: string,
    amount: number,
    currency: string,
    method: Payment['method'],
    stripePaymentIntentId?: string,
    options?: {
      stripeCheckoutSessionId?: string;
      checkoutDraft?: Order;
      stockReserved?: boolean;
    },
  ) {
    const now = new Date().toISOString();

    const payment: Payment = {
      paymentId: `PAY-${uuid()}`,
      orderId,
      userId,
      stripePaymentIntentId,
      stripeCheckoutSessionId: options?.stripeCheckoutSessionId,
      amount,
      currency,
      method,
      checkoutDraft: options?.checkoutDraft,
      stockReserved: options?.stockReserved,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    await this.paymentRepo.create(payment);
    return payment;
  }

  async markSuccess(paymentIntentId: string) {
    const payment = await this.paymentRepo.getByPaymentIntent(paymentIntentId);
    if (!payment) return null;

    await this.paymentRepo.updateStatus(
      payment.orderId,
      payment.paymentId,
      'SUCCESS',
    );
    return payment;
  }

  async markFailed(paymentIntentId: string) {
    const payment = await this.paymentRepo.getByPaymentIntent(paymentIntentId);
    if (!payment) return null;

    await this.paymentRepo.updateStatus(
      payment.orderId,
      payment.paymentId,
      'FAILED',
    );
    return payment;
  }

  async markSuccessBySession(sessionId: string) {
    const payment = await this.paymentRepo.getByCheckoutSessionId(sessionId);
    if (!payment) return null;

    await this.paymentRepo.updateStatus(
      payment.orderId,
      payment.paymentId,
      'SUCCESS',
    );
    return payment;
  }

  async markFailedBySession(sessionId: string) {
    const payment = await this.paymentRepo.getByCheckoutSessionId(sessionId);
    if (!payment) return null;

    await this.paymentRepo.updateStatus(
      payment.orderId,
      payment.paymentId,
      'FAILED',
    );
    return payment;
  }

  async markSuccessByOrder(orderId: string) {
    const payment = await this.paymentRepo.getByOrder(orderId);
    if (!payment) return null;

    await this.paymentRepo.updateStatus(
      payment.orderId,
      payment.paymentId,
      'SUCCESS',
    );
    return payment;
  }

  async markFailedByOrder(orderId: string) {
    const payment = await this.paymentRepo.getByOrder(orderId);
    if (!payment) return null;

    await this.paymentRepo.updateStatus(
      payment.orderId,
      payment.paymentId,
      'FAILED',
    );
    return payment;
  }

  getByCheckoutSessionId(sessionId: string) {
    return this.paymentRepo.getByCheckoutSessionId(sessionId);
  }

  getByOrder(orderId: string) {
    return this.paymentRepo.getByOrder(orderId);
  }
}
