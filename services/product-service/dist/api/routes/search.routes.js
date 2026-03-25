import { Router } from 'express';
import { searchProducts } from '../../controllers/search.controller.js';
const router = Router();
router.get('/', searchProducts);
export default router;
