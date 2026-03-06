import { Router } from 'express';
import { OrderController } from '../../controllers/order.controller.js';
import { OrderService } from '../../services/order.service.js';
import { DynamoOrderRepository } from '../../repositories/order.repository.dynamo.js';
import { adminOnly } from '../middlewares/auth.middleware.js';
import { DynamoRefundRepository } from '../../repositories/refund.repository.dynamo.js';
import { RefundService } from '../../services/refund.service.js';
import { DynamoPaymentRepository } from '../../repositories/payment.repository.dynamo.js';

const router = Router();

const orderRepo = new DynamoOrderRepository();
const refundRepo = new DynamoRefundRepository();
const paymentRepo = new DynamoPaymentRepository();
const refundService = new RefundService(refundRepo, paymentRepo);
const orderService = new OrderService(orderRepo, refundService);
const orderController = new OrderController(orderService);

router.get('/', orderController.getMyOrder);
router.get('/:orderId', orderController.getOrder);
router.post('/:orderId/cancel', orderController.cancelOrder);

//ADMIN ROUTES

router.get('/admin/all', adminOnly, orderController.getAllOrders);
router.patch('/:orderId/status', adminOnly, orderController.updateStatus);

export default router;
