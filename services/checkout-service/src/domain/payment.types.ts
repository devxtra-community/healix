export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Payment {
  paymentId: string;
  orderId: string;
  userId: string;

  stripePaymentIntentId: string;

  amount: number;
  currency: string;
  method: 'STRIPE';

  status: PaymentStatus;

  createdAt: string;
  updatedAt: string;
}
