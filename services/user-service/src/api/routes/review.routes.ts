import { Router } from 'express';
import { ReviewController } from '../../controllers/review.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ReviewRepository } from '../../repositories/review.repository.js';
import { ReviewService } from '../../services/review.service.js';

const router = Router();

const reviewRepo = new ReviewRepository();
const reviewService = new ReviewService(reviewRepo);
const reviewController = new ReviewController(reviewService);

router.post('/reviews', authMiddleware, reviewController.createReview);
router.patch('/reviews/:id', authMiddleware, reviewController.updateReview);
router.delete('/reviews/:id', authMiddleware, reviewController.deleteReview);

router.get('/products/:productId/reviews', reviewController.getProductReviews);
router.get('/products/:productId/rating', reviewController.getProductRating);

export default router;
