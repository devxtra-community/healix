import { Router } from 'express';
import { ReviewController } from '../../controllers/review.controller.js';
import { authMiddleware, adminOnly } from '../middlewares/auth.middleware.js';
import { ReviewRepository } from '../../repositories/review.repository.js';
import { ReviewService } from '../../services/review.service.js';

const router = Router();

const reviewRepo = new ReviewRepository();
const reviewService = new ReviewService(reviewRepo);
const reviewController = new ReviewController(reviewService);

router.post('/', authMiddleware, reviewController.createReview);
router.patch('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);
router.get('/', authMiddleware, reviewController.getAllReviews); // Users mapping or admin? Actually getAllReviews is just paginated list. For now we can keep authMiddleware so only logged-in users use it or maybe it implies admin. We'll leave it as is or change if needed.
router.patch(
  '/admin/:id/approve',
  authMiddleware,
  adminOnly,
  reviewController.approveReview,
);
router.get(
  '/admin/all',
  authMiddleware,
  adminOnly,
  reviewController.getAllReviews,
);

router.get('/products/:productId/reviews', reviewController.getProductReviews);
router.get('/products/:productId/rating', reviewController.getProductRating);

export default router;
