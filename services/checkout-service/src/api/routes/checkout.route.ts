import { Router } from 'express';
import { CheckoutController } from '../../controllers/checkout.controller.js';
import { CheckoutService } from '../../services/checkout.service.js';
import { DynamoCartRepository } from '../../repositories/cart.repository.dynamo.js';
import { DynamoOrderRepository } from '../../repositories/order.repository.dynamo.js';
import { PaymentService } from '../../services/payment.service.js';
import { DynamoPaymentRepository } from '../../repositories/payment.repository.dynamo.js';

const router = Router();

const cartRepo = new DynamoCartRepository();
const orderRepo = new DynamoOrderRepository();
const paymentRepo = new DynamoPaymentRepository();
const paymentService = new PaymentService(paymentRepo);
const checkoutService = new CheckoutService(
  cartRepo,
  orderRepo,
  paymentService,
);
const checkoutController = new CheckoutController(checkoutService);

router.post('/', checkoutController.checkOut);

export default router;
