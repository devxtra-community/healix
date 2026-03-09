import { Router } from 'express';
import { CartController } from '../../controllers/cart.controller.js';
import { CartService } from '../../services/cart.service.js';
import { cartRepository } from '../../repositories/cart.repository.factory.js';
import { AnalyticsService } from '../../analytics/analytics.service.js';

const route = Router();
const analyticsService = new AnalyticsService();

const cartService = new CartService(cartRepository, analyticsService);
const cartController = new CartController(cartService);
route.get('/', cartController.getCart);
route.post('/', cartController.addItem);
route.delete('/:productId/:variantId', cartController.removeItem);
route.delete('/', cartController.clearCart);

export default route;
