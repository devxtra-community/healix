import { Router } from "express";
import { AuthService } from "../../services/auth.service.ts";
import { AuthController } from "../../controllers/auth.controller.ts";

const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;
