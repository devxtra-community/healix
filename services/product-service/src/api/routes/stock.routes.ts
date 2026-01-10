import { Router } from 'express';
import { adminOnly } from '../middlewares/auth.middleware.js';
import { StockController } from '../../controllers/stock.controllers.js';

const router = Router();
const controller = new StockController();

router.post('/reserve', controller.reserveStock);
router.post('/confirm', controller.confirmStock);
router.post('/release', controller.releaseStock);

router.post('/restock', adminOnly, controller.reStock);
router.post('/decrease', adminOnly, controller.decreaseStock);
router.get('/:versionId', adminOnly, controller.getStock);

export default router;
