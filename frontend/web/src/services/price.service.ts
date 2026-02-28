import userApi from '../lib/axios.user';
import adminApi from '../lib/axios.admin';

export interface CreateDiscountPayload {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  usage_limit?: number;
  min_order_value?: number;
  start_date: Date;
  end_date: Date;
  active: boolean;
}

export interface ApplyCouponPayload {
  productId: string;
  couponCode: string;
  orderAmount: number;
}

export const pricingService = {
  getProductPrice: async (productId: string) => {
    const res = await userApi.get(`/product/price/${productId}`);
    return res.data;
  },

  applyCoupon: async (data: ApplyCouponPayload) => {
    const res = await userApi.post(`/product/price/apply`, data);
    return res.data;
  },

  createDiscount: async (data: CreateDiscountPayload) => {
    const res = await adminApi.post(`/product/price/discount`, data);
    return res.data;
  },

  getAllDiscounts: async () => {
    const res = await adminApi.get(`/product/price/discounts`);
    return res.data;
  },

  getDiscountById: async (discountId: string) => {
    const res = await adminApi.get(`/product/price/discount/${discountId}`);
    return res.data;
  },

  updateDiscount: async (
    discountId: string,
    data: Partial<CreateDiscountPayload>,
  ) => {
    const res = await adminApi.put(
      `/product/price/discount/${discountId}`,
      data,
    );
    return res.data;
  },

  deleteDiscount: async (discountId: string) => {
    const res = await adminApi.delete(`/product/price/discount/${discountId}`);
    return res.data;
  },
};
