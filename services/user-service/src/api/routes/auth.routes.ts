import { Router } from 'express';
import { AuthService } from '../../services/auth.service.js';
import { AuthController } from '../../controllers/auth.controller.js';
import passport from '../../config/passport.js';
import { generateToken } from '../../utils/jwt.js';
import type { IUser } from '../../models/user.model.js';
import { validate } from '../middlewares/validate.middleware.js';
import { LoginSchema, RegisterSchema } from '@healix/contracts';
const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/register', validate(RegisterSchema), authController.register);
router.post('/login', validate(LoginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

//passwordless login
router.post('/magic-link/request', authController.requestMagicLink);
router.post('/magic-link/verify', authController.verifyMagicLink);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      const user = req.user as IUser;

      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Set token in HTTP-only cookie (NOT in URL)
      res.cookie('token', token, {
        httpOnly: true, // JavaScript can't access it
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax', // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect WITHOUT token in URL
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?success=true`);
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=token_generation_failed`,
      );
      console.log(error);
    }
  },
);

export default router;
