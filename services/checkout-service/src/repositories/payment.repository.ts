import { Payment } from '../domain/payment.types.js';

export interface PaymentRepository {
  create(payment: Payment): Promise<void>;
  updateStatus(paymentId: string, status: Payment['status']): Promise<void>;
  getByPaymentIntent(paymentIntentId: string): Promise<Payment | null>;
}
