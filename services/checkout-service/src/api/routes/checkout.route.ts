import { Router } from 'express';
import { CheckoutController } from '../../controllers/checkout.controller.js';
import { CheckoutService } from '../../services/checkout.service.js';

const router = Router();
const checkoutService = new CheckoutService();
const checkoutController = new CheckoutController(checkoutService);

router.post('/', checkoutController.checkOut);
router.post('/stripe/create-session', checkoutController.createStripeSession);
router.get(
  '/stripe/session/:sessionId/verify',
  checkoutController.verifyStripeSession,
);

export default router;
