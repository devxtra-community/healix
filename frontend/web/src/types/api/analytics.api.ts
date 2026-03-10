export interface DashboardSummary {
  revenue: number;
  orders: number;
  avgOrderValue: number;
  refundRate: number;
  cartAbandonment: number;
  productViews: number;
  returningCustomers: number;
}

export interface OverviewStats {
  revenue: number;
  orders: number;
  avgOrderValue: number;
  refundRate: number;
}

export interface RevenueChartPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CartStats {
  cartsCreated: number;
  cartsConverted: number;
  abandonmentRate: number;
}

export interface FunnelStats {
  views: number;
  carts: number;
  checkout: number;
  orders: number;
}

export interface GrowthStats {
  revenueGrowth: number;
  orderGrowth: number;
}

export interface ProductStats {
  productId: string;
  sold: number;
  revenue: number;
  views: number;
}
