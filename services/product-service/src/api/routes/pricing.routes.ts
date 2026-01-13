import { Router } from 'express';
import { PricingController } from '../../controllers/pricing.controllers.js';
import { ProductRepository } from '../../repositories/product.repositories.js';
import { PricingRepository } from '../../repositories/pricing.repositories.js';
import { PricingService } from '../../services/pricing.services.js';
import { adminOnly } from '../middlewares/auth.middleware.js';
import { StockRepository } from '../../repositories/stock.repositories.js';

const router = Router();

const pricingService = new PricingService(
  new ProductRepository(),
  new PricingRepository(),
  new StockRepository(),
);

const pricingController = new PricingController(pricingService);

router.post('/base', adminOnly, pricingController.setBasePrice);
router.post('/discount', adminOnly, pricingController.createDiscount);
router.get('/:productId', pricingController.getActivePrice);

export default router;
