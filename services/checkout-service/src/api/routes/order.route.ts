import { Router } from 'express';
import { OrderController } from '../../controllers/order.controller.js';
import { OrderService } from '../../services/order.service.js';
import { DynamoOrderRepository } from '../../repositories/order.repository.dynamo.js';
import { adminOnly } from '../middlewares/auth.middleware.js';

const router = Router();

const orderRepo = new DynamoOrderRepository();
const orderService = new OrderService(orderRepo);
const orderController = new OrderController(orderService);

router.get('/', orderController.getMyOrder);
router.get('/:orderId', orderController.getOrder);

//ADMIN ROUTES

router.get('/admin/all', adminOnly, orderController.getAllOrders);
router.patch('/:orderId/status', adminOnly, orderController.updateStatus);

export default router;
