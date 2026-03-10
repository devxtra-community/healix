import userApi from '../lib/axios.user';

export type AddToCartPayload = {
  productId: string;
  quantity: number;
  variantId: string;
};

export const cartService = {
  addToCart: async (data: AddToCartPayload) => {
    const res = await userApi.post('/cart', data);
    return res.data;
  },

  getCart: async () => {
    const res = await userApi.get('/cart');
    return res.data;
  },

  updateCartItemQuantity: async (data: AddToCartPayload) => {
    const res = await userApi.post('/cart', data);
    return res.data;
  },

  removeCartItem: async (productId: string, variantId: string) => {
    const res = await userApi.delete(`/cart/${productId}/${variantId}`);
    return res.data;
  },
};
