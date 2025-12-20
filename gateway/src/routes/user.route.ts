import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { verifyToken } from "../middleware/auth.middleware.ts";
const router = Router();

const userServiceProxy = createProxyMiddleware({
    target: process.env.USER_SERVICE_URL!,
    changeOrigin: true,

    on: {
        proxyReq(proxyReq, req: any) {
            if (req.user) {
                proxyReq.setHeader("x-user-id", req.user.sub);
            }
        },
    },
});

router.post("/login", userServiceProxy);
router.post("/register", userServiceProxy);
router.get("/profile", verifyToken, userServiceProxy);
router.post("/change_password", verifyToken, userServiceProxy);
router.post("/update_profile", verifyToken, userServiceProxy);

export default router;
