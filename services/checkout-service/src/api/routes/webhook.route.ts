import { Router } from 'express';
import { StripeWebHookController } from '../../controllers/stripe.webhook.controller.js';
import { PaymentService } from '../../services/payment.service.js';
import { OrderService } from '../../services/order.service.js';

import { DynamoPaymentRepository } from '../../repositories/payment.repository.dynamo.js';
import { DynamoOrderRepository } from '../../repositories/order.repository.dynamo.js';
import { DynamoCartRepository } from '../../repositories/cart.repository.dynamo.js';

import { webhookIdempotency } from '../../utils/webhook-idempotency.js';
import { redis } from '../../config/redis.js';

const router = Router();

const paymentRepo = new DynamoPaymentRepository();
const orderRepo = new DynamoOrderRepository();
const cartRepo = new DynamoCartRepository();

const paymentService = new PaymentService(paymentRepo);
const orderService = new OrderService(orderRepo);

const webhookidempotency = new webhookIdempotency(redis);

const webhookcontroller = new StripeWebHookController(
  paymentService,
  orderService,
  cartRepo,
  webhookidempotency,
);
router.post('/', webhookcontroller.handle);

export default router;
