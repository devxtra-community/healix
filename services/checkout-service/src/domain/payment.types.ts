export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Payment {
  paymentId: string;
  orderId: string;
  userId: string;

  stripePaymentIntentId?: string;

  amount: number;
  currency: string;
  method: 'STRIPE' | 'COD';

  status: PaymentStatus;

  createdAt: string;
  updatedAt: string;
}
export type RefundStatus = 'REQUESTED' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface Refund {
  refundId: string;
  orderId: string;
  paymentId: string;

  stripeRefundId?: string;

  amount: number;
  currency: string;

  status: RefundStatus;

  createdAt: string;
  updatedAt: string;
}
