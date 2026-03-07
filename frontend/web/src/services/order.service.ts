import userApi from '../lib/axios.user';

export type UserOrderItem = {
  productId: string;
  variantId: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type UserOrder = {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  paymentMethod?: 'STRIPE' | 'COD';
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  fulfillmentStatus:
    | 'PLACED'
    | 'PACKED'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';
  createdAt: string;
  items: UserOrderItem[];
  addressSnapshot?: {
    addressType?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    data?: {
      addressType?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      country?: string;
      zip?: string;
    };
  };
};

export const orderService = {
  getMyOrders: async (): Promise<UserOrder[]> => {
    const res = await userApi.get<
      UserOrder[] | { data?: UserOrder[]; orders?: UserOrder[] }
    >('/order');

    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data?.orders)) return res.data.orders;

    return [];
  },

  getStripeClientSecret: async (orderId: string) => {
    const res = await userApi.post<{ orderId: string; clientSecret: string }>(
      `/order/${orderId}/pay`,
    );
    return res.data;
  },

  async cancelOrder(orderId: string): Promise<{ success: boolean }> {
    const res = await userApi.post(`/order/${orderId}/cancel`);
    return res.data;
  },

  syncStripePaymentStatus: async (
    orderId: string,
  ): Promise<{
    orderId: string;
    paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  }> => {
    const res = await userApi.post<{
      orderId: string;
      paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
    }>(`/order/${orderId}/sync-payment`);
    return res.data;
  },
};
