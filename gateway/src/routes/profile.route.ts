 import { Router } from "express";
    import { createProxyMiddleware } from "http-proxy-middleware";
    import { verifyToken } from "../middleware/auth.middleware.ts";
    const router = Router();

    const userServiceProxy = createProxyMiddleware({
        target: process.env.USER_SERVICE_URL!,
        changeOrigin: true,
pathRewrite: {
     "^/": "/api/v1/profile/",
  },
        on: {
            proxyReq(proxyReq, req: any) {
                if (req.user) {
                    proxyReq.setHeader("x-user-id", req.user.sub);
                }
            },
        },
    });
router.get("/", verifyToken, userServiceProxy);
router.put("/", verifyToken, userServiceProxy);
router.post("/", verifyToken, userServiceProxy);
router.delete("/", verifyToken, userServiceProxy);

export default router