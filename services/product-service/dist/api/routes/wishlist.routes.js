import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist, } from '../../controllers/wishlist.controller.js';
const router = Router();
//routes
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.patch('/clear', clearWishlist);
export default router;
