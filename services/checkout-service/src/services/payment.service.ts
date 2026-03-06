import { v4 as uuid } from 'uuid';
import { PaymentRepository } from '../repositories/payment.repository.js';
import { Payment } from '../domain/payment.types.js';

export class PaymentService {
  constructor(private paymentRepo: PaymentRepository) {}

  async createPendingPayment(
    orderId: string,
    userId: string,
    amount: number,
    currency: string,
    method: Payment['method'],
    stripePaymentIntentId?: string,
  ) {
    const now = new Date().toISOString();

    const payment: Payment = {
      paymentId: `PAY-${uuid()}`,
      orderId,
      userId,
      stripePaymentIntentId,
      amount,
      currency,
      method,
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
}
