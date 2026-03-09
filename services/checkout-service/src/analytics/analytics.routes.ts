import { Router } from 'express';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsController } from './analytics.controller.js';

const router = Router();

const analyticsService = new AnalyticsService();
const controller = new AnalyticsController(analyticsService);

router.get('/overview', controller.getOverview);
router.get('/revenue', controller.getRevenueChart);
router.get('/cart', controller.getCartStats);
router.get('/products/top', controller.getTopProducts);
router.get('/products/views', controller.getMostViewedProducts);
router.get('/products/revenue', controller.getTopRevenueProducts);
router.post('/product-view', controller.trackProductView);
router.get('/funnel', controller.getFunnelStats);
router.get('/dashboard', controller.getDashboardSummary);
router.get('/growth', controller.getGrowthStats);

export default router;
