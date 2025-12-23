import { Router } from "express";
import { AuthService } from "../../services/auth.service.ts";
import { AuthController } from "../../controllers/auth.controller.ts";
import cookieParser from 'cookie-parser';
import passport from '../../config/passport.ts';
import { generateToken } from '../../utils/jwt.ts';
const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      const user = req.user as any;
      
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Set token in HTTP-only cookie (NOT in URL)
      res.cookie('token', token, {
        httpOnly: true,      // JavaScript can't access it
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax',     // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      // Redirect WITHOUT token in URL
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?success=true`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  }
);


export default router;
