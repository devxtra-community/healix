import { Router } from 'express';
import { ProdutController } from '../../controllers/product.controllers.js';
import { adminOnly } from '../middlewares/auth.middleware.js';
const router = Router();
const productcontroller = new ProdutController();
router.get('/admin/all', adminOnly, productcontroller.getAllProductsForAdmin);
router.get('/:productId', productcontroller.getProduct);
router.post('/', adminOnly, productcontroller.createProduct);
router.post(
  '/:productId/versions',
  adminOnly,
  productcontroller.createNewVersion,
);
router.get('/', productcontroller.getProductsForUser);
router.delete('/:productId', productcontroller.deleteProduct);

export default router;
