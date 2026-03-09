import { Router } from 'express';
import { CheckoutController } from '../../controllers/checkout.controller.js';
import { CheckoutService } from '../../services/checkout.service.js';
import { DynamoOrderRepository } from '../../repositories/order.repository.dynamo.js';
import { PaymentService } from '../../services/payment.service.js';
import { DynamoPaymentRepository } from '../../repositories/payment.repository.dynamo.js';
import { cartRepository } from '../../repositories/cart.repository.factory.js';
import { AnalyticsService } from '../../analytics/analytics.service.js';

const router = Router();

const orderRepo = new DynamoOrderRepository();
const paymentRepo = new DynamoPaymentRepository();
const paymentService = new PaymentService(paymentRepo);
const analyticsService = new AnalyticsService();
const checkoutService = new CheckoutService(
  cartRepository,
  orderRepo,
  paymentService,
  analyticsService,
);
const checkoutController = new CheckoutController(checkoutService);

router.post('/', checkoutController.checkOut);

export default router;
