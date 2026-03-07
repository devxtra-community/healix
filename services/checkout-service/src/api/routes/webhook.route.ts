import { Router } from 'express';
import express from 'express';
import { StripeWebHookController } from '../../controllers/stripe.webhook.controller.js';
import { PaymentService } from '../../services/payment.service.js';
import { OrderService } from '../../services/order.service.js';

import { DynamoPaymentRepository } from '../../repositories/payment.repository.dynamo.js';
import { DynamoOrderRepository } from '../../repositories/order.repository.dynamo.js';
import { cartRepository } from '../../repositories/cart.repository.factory.js';

import { webhookIdempotency } from '../../utils/webhook-idempotency.js';
import { redis } from '../../config/redis.js';
import { DynamoRefundRepository } from '../../repositories/refund.repository.dynamo.js';
import { RefundService } from '../../services/refund.service.js';

const router = Router();

const paymentRepo = new DynamoPaymentRepository();
const orderRepo = new DynamoOrderRepository();
const refundRepo = new DynamoRefundRepository();

const paymentService = new PaymentService(paymentRepo);
const refundService = new RefundService(refundRepo, paymentRepo);
const orderService = new OrderService(orderRepo, refundService, paymentRepo);

const webhookidempotency = new webhookIdempotency(redis);

const webhookcontroller = new StripeWebHookController(
  paymentService,
  orderService,
  cartRepository,
  webhookidempotency,
  refundRepo,
);

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  webhookcontroller.handle,
);

export default router;
