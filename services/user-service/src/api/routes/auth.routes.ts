import { Router } from "express";
import {
  login,
  logout,
  refresh,
  register,
} from "../../controllers/auth.controller.ts";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.delete("/logout", logout);


export default router