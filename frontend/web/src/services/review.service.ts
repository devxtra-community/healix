import adminApi from '../lib/axios.admin';
import userApi from '../lib/axios.user';

export const reviewService = {
  // ✅ Create Review
  createReview: async (data: {
    productId: string;
    rating: number;
    reviewerGoal:
      | 'weight-loss'
      | 'muscle-gain'
      | 'gut-health'
      | 'general-wellness';
    usagePeriod: string;
    title?: string;
    description: string;
    attachments?: {
      type: 'image' | 'video';
      url: string;
    }[];
  }) => {
    const res = await adminApi.post('/reviews', data); //later user
    return res.data;
  },

  // ✅ Update Review
  updateReview: async (
    reviewId: string,
    data: Partial<{
      rating: number;
      title: string;
      description: string;
      usagePeriod: string;
      reviewerGoal: string;
      isApproved: boolean; // for admin
    }>,
  ) => {
    const res = await userApi.patch(`/reviews/${reviewId}`, data);
    return res.data;
  },

  // ✅ Delete Review
  deleteReview: async (reviewId: string) => {
    const res = await userApi.delete(`/reviews/${reviewId}`);
    return res.data;
  },

  // ✅ Get Reviews for a Product
  getProductReviews: async (productId: string, page = 1, limit = 10) => {
    const res = await userApi.get(
      `/products/${productId}/reviews?page=${page}&limit=${limit}`,
    );
    return res.data;
  },

  // ✅ Get Product Rating Summary
  getProductRating: async (productId: string) => {
    const res = await userApi.get(`/products/${productId}/rating`);
    return res.data;
  },

  // ✅ Admin - Get All Reviews
  getAllReviews: async (page = 1, limit = 10) => {
    const res = await adminApi.get(`/reviews?page=${page}&limit=${limit}`);
    return res.data;
  },
};
