import userApi from '../lib/axios.user';

export const wishlistService = {
  addToWishlist: async (productId: string) => {
    const res = await userApi.post('/wishlist', { productId });
    return res.data;
  },

  getWishlist: async () => {
    const res = await userApi.get('/wishlist');
    return res.data;
  },

  removeFromWishlist: async (productId: string) => {
    const res = await userApi.delete(`/wishlist/${productId}`);
    return res.data;
  },

  clearWishlist: async () => {
    const res = await userApi.patch('/wishlist/clear');
    return res.data;
  },
};
