import { Router } from 'express';
import { CartController } from '../../controllers/cart.controller.js';
import { CartService } from '../../services/cart.service.js';
import { DynamoCartRepository } from '../../repositories/cart.repository.dynamo.js';

const route = Router();

const cartRepository = new DynamoCartRepository();
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);
route.get('/', cartController.getCart);
route.post('/', cartController.addItem);
route.delete('/:productId/:variantId', cartController.removeItem);
route.delete('/', cartController.clearCart);

export default route;
