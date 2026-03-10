import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service.js';

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  // SALES OVERVIEW

  getOverview = async (req: Request, res: Response) => {
    try {
      const data = await this.analyticsService.getOverview();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch overview' });
    }
  };

  getRevenueChart = async (req: Request, res: Response) => {
    try {
      const days = Number(req.query.range) || 30;
      const data = await this.analyticsService.getRevenueChart(days);

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch revenue chart' });
    }
  };

  getGrowthStats = async (req: Request, res: Response) => {
    try {
      const data = await this.analyticsService.getGrowthStats();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch growth stats' });
    }
  };

  // CART ANALYTICS

  getCartStats = async (req: Request, res: Response) => {
    try {
      const data = await this.analyticsService.getCartStats();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch cart analytics' });
    }
  };

  // PRODUCT ANALYTICS

  // TOP SELLING PRODUCTS
  getTopProducts = async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const data = await this.analyticsService.getTopProducts(limit);

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch top products' });
    }
  };

  // MOST VIEWED PRODUCTS
  getMostViewedProducts = async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const data = await this.analyticsService.getMostViewedProducts(limit);

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch viewed products' });
    }
  };

  // HIGHEST REVENUE PRODUCTS
  getTopRevenueProducts = async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const data = await this.analyticsService.getTopRevenueProducts(limit);

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch revenue products' });
    }
  };

  trackProductView = async (req: Request, res: Response) => {
    try {
      const { productId } = req.body;

      await this.analyticsService.trackProductView(productId);

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to set views' });
    }
  };

  // FUNNEL ANALYTICS

  getFunnelStats = async (req: Request, res: Response) => {
    try {
      const data = await this.analyticsService.getFunnelStats();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch funnel stats' });
    }
  };

  // DASHBOARD SUMMARY

  getDashboardSummary = async (req: Request, res: Response) => {
    try {
      const data = await this.analyticsService.getDashboardSummary();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch dashboard summary' });
    }
  };

  // USER ANALYTICS

  getUserAnalytics = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const data = await this.analyticsService.getUserAnalytics(userId);

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch user analytics' });
    }
  };

  getTopCustomers = async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 10;

      const data = await this.analyticsService.getTopCustomers(limit);

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch top customers' });
    }
  };

  getMostActiveCustomers = async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 10;

      const data = await this.analyticsService.getMostActiveCustomers(limit);

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch active customers' });
    }
  };

  getUserOverview = async (req: Request, res: Response) => {
    try {
      const data = await this.analyticsService.getUserOverview();

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch user overview' });
    }
  };
}
