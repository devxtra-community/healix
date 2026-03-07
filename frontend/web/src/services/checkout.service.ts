import userApi from '../lib/axios.user';

export type PaymentMethod = 'STRIPE' | 'COD';

export type CheckoutPayload = {
  addressId: string;
  paymentMethod: PaymentMethod;
};

export type CheckoutResponse = {
  canProceed: boolean;
  orderId?: string;
  message?: string;
  unavailableItems?: unknown[];
  paymentMethod?: PaymentMethod;
  paymentIntentClientSecret?: string | null;
};

export const checkoutService = {
  checkout: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    const res = await userApi.post<CheckoutResponse>('/checkout', payload);
    return res.data;
  },
};
