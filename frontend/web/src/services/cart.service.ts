import userApi from '../lib/axios.user';

export const cartService = {
  addToCart: async (data: {
    productId: string;
    quantity: number;
    variantId: string;
  }) => {
    const res = await userApi.post('/cart', data);
    console.log(res);
    return res.data;
  },

  getCart: async () => {
    const res = await userApi.get('/cart');
    return res.data;
  },
};
