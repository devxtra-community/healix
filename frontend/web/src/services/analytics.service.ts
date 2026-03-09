import adminApi from '../lib/axios.admin';
import userApi from '../lib/axios.user';

import {
  DashboardSummary,
  OverviewStats,
  RevenueChartPoint,
  CartStats,
  FunnelStats,
  GrowthStats,
  ProductStats,
} from '../types/api/analytics.api';

export const analyticsService = {
  // Dashboard summary
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const res = await adminApi.get('/analytics/dashboard');
    return res.data;
  },

  // Overview stats
  getOverview: async (): Promise<OverviewStats> => {
    const res = await adminApi.get('/analytics/overview');
    return res.data;
  },

  // Revenue chart
  getRevenueChart: async (range = 30): Promise<RevenueChartPoint[]> => {
    const res = await adminApi.get('/analytics/revenue', {
      params: { range },
    });
    return res.data;
  },

  // Cart analytics
  getCartStats: async (): Promise<CartStats> => {
    const res = await adminApi.get('/analytics/cart');
    return res.data;
  },

  // Funnel analytics
  getFunnelStats: async (): Promise<FunnelStats> => {
    const res = await adminApi.get('/analytics/funnel');
    return res.data;
  },

  // Growth analytics
  getGrowthStats: async (): Promise<GrowthStats> => {
    const res = await adminApi.get('/analytics/growth');
    return res.data;
  },

  // Top selling products
  getTopProducts: async (limit = 5): Promise<ProductStats[]> => {
    const res = await adminApi.get('/analytics/products/top', {
      params: { limit },
    });
    return res.data;
  },

  // Most viewed products
  getMostViewedProducts: async (limit = 5): Promise<ProductStats[]> => {
    const res = await adminApi.get('/analytics/products/views', {
      params: { limit },
    });
    return res.data;
  },

  // Highest revenue products
  getTopRevenueProducts: async (limit = 5): Promise<ProductStats[]> => {
    const res = await adminApi.get('/analytics/products/revenue', {
      params: { limit },
    });
    return res.data;
  },

  // Product view tracking
  trackProductView: async (
    productId: string,
  ): Promise<{ success: boolean }> => {
    const res = await userApi.post('/analytics/product-view', {
      productId,
    });
    return res.data;
  },
};
