import { Router } from 'express';
import { PricingController } from '../../controllers/pricing.controllers.js';
import { ProductRepository } from '../../repositories/product.repositories.js';
import { PricingRepository } from '../../repositories/pricing.repositories.js';
import { PricingService } from '../../services/pricing.service.js';
import { adminOnly } from '../middlewares/auth.middleware.js';

const router = Router();

const pricingService = new PricingService(
  new ProductRepository(),
  new PricingRepository(),
);

const pricingController = new PricingController(pricingService);

router.post('/base', adminOnly, pricingController.setBasePrice);
router.post('/discount', adminOnly, pricingController.applyDiscount);
router.get('/:productId', pricingController.getActivePrice);

export default router;