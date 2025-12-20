import { Router } from "express";
import { forwardToUserService } from "../service/user.proxy.ts";

const router = Router();

router.use(async (req, res) => {
  try {
    const response = await forwardToUserService(req);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error("Gateway error:", {
      message: error.message,
      code: error.code,
      url: error.config?.url,
    });

    res.status(error.response?.status || 500).json({
      message: error.response?.data || "User service error",
    });
  }
});

export default router;
