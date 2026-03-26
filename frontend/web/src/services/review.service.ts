import adminApi from '../lib/axios.admin';
import userApi from '../lib/axios.user';

export interface ReviewItem {
  _id: string;
  productId?: string;
  userId?: string;
  userName: string;
  productName?: string;
  rating: number;
  reviewerGoal?: string;
  usagePeriod?: string;
  title?: string;
  description?: string;
  attachments?: {
    type: 'image' | 'video';
    url: string;
  }[];
  isApproved?: boolean;
  isVerifiedPurchase?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductReviewsResponse {
  data: ReviewItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ProductRatingSummary {
  averageRating: number;
  totalReviews: number;
}

export const reviewService = {
  // ✅ Create Review
  createReview: async (data: {
    productId: string;
    userName: string;
    productName: string;
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
    const res = await userApi.post('/reviews', data);
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
  getProductReviews: async (
    productId: string,
    page = 1,
    limit = 10,
  ): Promise<ProductReviewsResponse> => {
    const res = await userApi.get(
      `/reviews/products/${productId}/reviews?page=${page}&limit=${limit}`,
    );
    return res.data;
  },

  // ✅ Get Product Rating Summary
  getProductRating: async (
    productId: string,
  ): Promise<ProductRatingSummary> => {
    const res = await userApi.get(`/reviews/products/${productId}/rating`);
    return res.data;
  },

  // ✅ Admin - Get All Reviews
  getAllReviews: async (page = 1, limit = 10) => {
    const res = await adminApi.get(
      `/reviews/admin/all?page=${page}&limit=${limit}`,
    );
    return res.data;
  },

  // ✅ Admin - Approve review
  updateReviewStatus: async (reviewId: string, isApproved: boolean) => {
    const res = await adminApi.patch(`/reviews/admin/${reviewId}/approve`, {
      isApproved,
    });
    return res.data;
  },
};
