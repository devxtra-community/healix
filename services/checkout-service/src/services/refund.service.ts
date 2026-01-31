import { RefundRepository } from '../repositories/refund.repository.js';
import { PaymentRepository } from '../repositories/payment.repository.js';
import { Order } from '../domain/order.type.js';
import { Refund } from '../domain/payment.types.js';
import { v4 as uuid } from 'uuid';
import { stripe } from '../config/stripe.js';
import { Payment } from '../domain/payment.types.js';
export class RefundService {
  constructor(
    private refundRepo: RefundRepository,
    private paymentRepo: PaymentRepository,
  ) {}

  async createRefund(order: Order) {
    const existing = await this.refundRepo.getByOrder(order.orderId);
    if (existing.length > 0) return;
    const payment = await this.paymentRepo.getByOrder(order.orderId);
    if (!payment) throw new Error('Payment not found');

    const now = new Date().toISOString();

    const refund: Refund = {
      refundId: `REF-${uuid()}`,
      orderId: order.orderId,
      paymentId: payment.paymentId,
      amount: order.totalAmount,
      currency: order.currency,
      status: 'REQUESTED',
      createdAt: now,
      updatedAt: now,
    };

    await this.refundRepo.create(refund);
    await this.processRefund(refund, payment);
  }

  async processRefund(refund: Refund, payment: Payment) {
    const stripeRefund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round(refund.amount * 100),
      metadata: {
        orderId: refund.orderId,
        refundId: refund.refundId,
      },
    });

    await this.refundRepo.updateStatus(
      refund.orderId,
      refund.refundId,
      'SUCCESS',
      stripeRefund.id,
    );
  }
}
