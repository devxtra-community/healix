import { Router } from 'express';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsController } from './analytics.controller.js';

const router = Router();

const analyticsService = new AnalyticsService();
const controller = new AnalyticsController(analyticsService);

/* =============================
   SALES ANALYTICS
============================= */

router.get('/overview', controller.getOverview);
router.get('/revenue', controller.getRevenueChart);
router.get('/growth', controller.getGrowthStats);

//DASHBOARD SUMMARY

router.get('/dashboard', controller.getDashboardSummary);

//CART ANALYTICS

router.get('/cart', controller.getCartStats);

//PRODUCT ANALYTICS

router.get('/products/top', controller.getTopProducts);
router.get('/products/views', controller.getMostViewedProducts);
router.get('/products/revenue', controller.getTopRevenueProducts);

router.post('/product-view', controller.trackProductView);

//FUNNEL ANALYTICS

router.get('/funnel', controller.getFunnelStats);

//USER ANALYTICS

router.get('/users/top', controller.getTopCustomers);
router.get('/users/active', controller.getMostActiveCustomers);
router.get('/users/overview', controller.getUserOverview);
router.get('/users/:userId', controller.getUserAnalytics);

export default router;
