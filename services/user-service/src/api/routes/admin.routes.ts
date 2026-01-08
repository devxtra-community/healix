import { Router } from 'express';
import { AuthService } from '../../services/auth.service.js';
import { AuthController } from '../../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { LoginSchema } from '@healix/contracts';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/login', validate(LoginSchema), authController.loginAdmin);
router.post('/refresh', authMiddleware, authController.refreshAdmin);
router.delete('/logout', authController.logoutAdmin);
router.get('/me', authMiddleware, authController.me);

export default router;
