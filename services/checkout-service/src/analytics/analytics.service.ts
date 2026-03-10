import { Order } from '../domain/order.type.js';
import { CartStats } from './models/cartStats.model.js';
import { FunnelStats } from './models/funnelStats.model.js';
import { ProductStats } from './models/productStats.model.js';
import { SalesDaily } from './models/salesDaily.model.js';
import { UserStats } from './models/userAnalytics.model.js';

export class AnalyticsService {
  //ORDER CREATED

  async trackOrder(order: Order): Promise<void> {
    const date = new Date(order.createdAt).toISOString().split('T')[0];

    const productUpdates = order.items.map((item) =>
      ProductStats.updateOne(
        { productId: item.productId },
        {
          $inc: {
            sold: item.quantity,
            revenue: item.subtotal,
          },
        },
        { upsert: true },
      ),
    );

    await Promise.all([
      SalesDaily.updateOne(
        { date },
        {
          $inc: {
            revenue: order.totalAmount,
            orders: 1,
          },
        },
        { upsert: true },
      ),

      CartStats.updateOne(
        { date },
        { $inc: { cartsConverted: 1 } },
        { upsert: true },
      ),

      FunnelStats.updateOne(
        { date },
        { $inc: { ordersCompleted: 1 } },
        { upsert: true },
      ),

      UserStats.updateOne(
        { userId: order.userId },
        {
          $inc: {
            totalOrders: 1,
            totalSpent: order.totalAmount,
          },
          $set: {
            lastOrderAt: new Date(order.createdAt),
          },
        },
        { upsert: true },
      ),

      ...productUpdates,
    ]);
  }

  //REFUND CREATED

  async trackRefund(amount: number, createdAt: string): Promise<void> {
    const date = new Date(createdAt).toISOString().split('T')[0];

    await SalesDaily.updateOne(
      { date },
      {
        $inc: {
          refunds: 1,
          revenue: -amount,
        },
      },
    );
  }

  //CART CREATED

  async trackCartCreated(): Promise<void> {
    const date = new Date().toISOString().split('T')[0];

    await CartStats.updateOne(
      { date },
      {
        $inc: {
          cartsCreated: 1,
        },
      },
      { upsert: true },
    );
  }

  //PRODUCT VIEW

  async trackProductView(productId: string): Promise<void> {
    await ProductStats.updateOne(
      { productId },
      {
        $inc: {
          views: 1,
        },
      },
      { upsert: true },
    );

    const date = new Date().toISOString().split('T')[0];

    await FunnelStats.updateOne(
      { date },
      { $inc: { productViews: 1 } },
      { upsert: true },
    );
  }

  //DASHBOARD OVERVIEW

  async getOverview(days = 30) {
    const start = new Date();
    start.setDate(start.getDate() - days);

    const stats = await SalesDaily.aggregate([
      {
        $match: {
          date: { $gte: start.toISOString().split('T')[0] },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$revenue' },
          orders: { $sum: '$orders' },
          refunds: { $sum: '$refunds' },
        },
      },
    ]);

    const data = stats[0] ?? {
      revenue: 0,
      orders: 0,
      refunds: 0,
    };

    const avgOrderValue = data.orders > 0 ? data.revenue / data.orders : 0;

    const refundRate = data.orders > 0 ? (data.refunds / data.orders) * 100 : 0;

    return {
      revenue: data.revenue,
      orders: data.orders,
      avgOrderValue,
      refundRate,
    };
  }
  //REVENUE CHART

  async getRevenueChart(days = 30) {
    const start = new Date();
    start.setDate(start.getDate() - days);

    return SalesDaily.find({
      date: { $gte: start.toISOString().split('T')[0] },
    }).sort({ date: 1 });
  }

  // CART ANALYTICS

  async getCartStats() {
    const stats = await CartStats.aggregate([
      {
        $group: {
          _id: null,
          cartsCreated: { $sum: '$cartsCreated' },
          cartsConverted: { $sum: '$cartsConverted' },
        },
      },
    ]);

    const data = stats[0] ?? {
      cartsCreated: 0,
      cartsConverted: 0,
    };

    const abandonmentRate =
      data.cartsCreated > 0
        ? ((data.cartsCreated - data.cartsConverted) / data.cartsCreated) * 100
        : 0;

    return {
      cartsCreated: data.cartsCreated,
      cartsConverted: data.cartsConverted,
      abandonmentRate,
    };
  }

  async getTopProducts(limit = 5) {
    return ProductStats.find().sort({ sold: -1 }).limit(limit);
  }

  async getMostViewedProducts(limit = 5) {
    return ProductStats.find().sort({ views: -1 }).limit(limit);
  }

  async getTopRevenueProducts(limit = 5) {
    return ProductStats.find().sort({ revenue: -1 }).limit(limit);
  }

  async getProductOverview() {
    const stats = await ProductStats.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalSold: { $sum: '$sold' },
          totalRevenue: { $sum: '$revenue' },
        },
      },
    ]);

    return (
      stats[0] ?? {
        totalViews: 0,
        totalSold: 0,
        totalRevenue: 0,
      }
    );
  }

  async trackAddToCart(): Promise<void> {
    const date = new Date().toISOString().split('T')[0];

    await FunnelStats.updateOne(
      { date },
      { $inc: { addToCart: 1 } },
      { upsert: true },
    );
  }

  async trackCheckoutStarted(): Promise<void> {
    const date = new Date().toISOString().split('T')[0];

    await FunnelStats.updateOne(
      { date },
      { $inc: { checkoutStarted: 1 } },
      { upsert: true },
    );
  }

  async getFunnelStats() {
    const stats = await FunnelStats.aggregate([
      {
        $group: {
          _id: null,
          views: { $sum: '$productViews' },
          carts: { $sum: '$addToCart' },
          checkout: { $sum: '$checkoutStarted' },
          orders: { $sum: '$ordersCompleted' },
        },
      },
    ]);

    return (
      stats[0] ?? {
        views: 0,
        carts: 0,
        checkout: 0,
        orders: 0,
      }
    );
  }

  async getDashboardSummary() {
    const overview = await this.getOverview();
    const cart = await this.getCartStats();

    const productViews = await ProductStats.aggregate([
      {
        $group: {
          _id: null,
          views: { $sum: '$views' },
        },
      },
    ]);

    const views = productViews[0]?.views ?? 0;

    return {
      revenue: overview.revenue,
      orders: overview.orders,
      avgOrderValue: overview.avgOrderValue,
      refundRate: overview.refundRate,

      cartAbandonment: cart.abandonmentRate,

      productViews: views,
    };
  }

  async getGrowthStats() {
    const today = new Date();

    const startCurrent = new Date();
    startCurrent.setDate(today.getDate() - 30);

    const startPrevious = new Date();
    startPrevious.setDate(today.getDate() - 60);

    const current = await SalesDaily.aggregate([
      {
        $match: {
          date: { $gte: startCurrent.toISOString().split('T')[0] },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$revenue' },
          orders: { $sum: '$orders' },
        },
      },
    ]);

    const previous = await SalesDaily.aggregate([
      {
        $match: {
          date: {
            $gte: startPrevious.toISOString().split('T')[0],
            $lt: startCurrent.toISOString().split('T')[0],
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$revenue' },
          orders: { $sum: '$orders' },
        },
      },
    ]);

    const currentData = current[0] ?? { revenue: 0, orders: 0 };
    const previousData = previous[0] ?? { revenue: 0, orders: 0 };

    const revenueGrowth =
      previousData.revenue > 0
        ? ((currentData.revenue - previousData.revenue) /
            previousData.revenue) *
          100
        : 0;

    const orderGrowth =
      previousData.orders > 0
        ? ((currentData.orders - previousData.orders) / previousData.orders) *
          100
        : 0;

    return {
      revenueGrowth,
      orderGrowth,
    };
  }

  async getUserAnalytics(userId: string) {
    return UserStats.findOne({ userId });
  }

  async getTopCustomers(limit = 10) {
    return UserStats.find().sort({ totalSpent: -1 }).limit(limit);
  }

  async getMostActiveCustomers(limit = 10) {
    return UserStats.find().sort({ totalOrders: -1 }).limit(limit);
  }

  async getUserOverview() {
    const stats = await UserStats.aggregate([
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          totalOrders: { $sum: '$totalOrders' },
          totalRevenue: { $sum: '$totalSpent' },
        },
      },
    ]);

    return (
      stats[0] ?? {
        totalCustomers: 0,
        totalOrders: 0,
        totalRevenue: 0,
      }
    );
  }

  async getCustomerGrowth() {
    return UserStats.aggregate([
      {
        $group: {
          _id: '$createdAt',
          users: { $sum: 1 },
        },
      },
    ]);
  }
}
