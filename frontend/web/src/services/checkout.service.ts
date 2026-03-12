import userApi from '../lib/axios.user';

export type PaymentMethod = 'STRIPE' | 'COD';

export type CheckoutPayload = {
  addressId: string;
  paymentMethod: PaymentMethod;
};

export type CheckoutResponse = {
  status: 'PROCESSING';
  message?: string;
  orderId?: string;
};

export type StripeSessionResponse = {
  status: 'PROCESSING';
  sessionUrl: string;
  sessionId: string;
};

export type StripeSessionVerificationResponse = {
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  sessionId: string;
  orderId?: string;
};

export const checkoutService = {
  checkout: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    const res = await userApi.post<CheckoutResponse>('/checkout', payload);
    return res.data;
  },

  createStripeSession: async (
    addressId: string,
  ): Promise<StripeSessionResponse> => {
    const res = await userApi.post<StripeSessionResponse>(
      '/checkout/stripe/create-session',
      { addressId },
    );
    return res.data;
  },

  verifyStripeSession: async (
    sessionId: string,
  ): Promise<StripeSessionVerificationResponse> => {
    const res = await userApi.get<StripeSessionVerificationResponse>(
      `/checkout/stripe/session/${encodeURIComponent(sessionId)}/verify`,
    );
    return res.data;
  },
};
