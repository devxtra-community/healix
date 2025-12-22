import { Router } from "express";
    import { createProxyMiddleware } from "http-proxy-middleware";
    import { verifyToken } from "../middleware/auth.middleware.ts";
    const router = Router();
    const userServiceProxy = createProxyMiddleware({
        target: process.env.USER_SERVICE_URL!,
        changeOrigin: true,
 pathRewrite: {
     "^/login": "/api/v1/auth/login",
    "^/register": "/api/v1/auth/register",
    "^/refresh": "/api/v1/auth/refresh",
  },
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
    router.put("/change_password", verifyToken, userServiceProxy);
    router.post("/logout", verifyToken, userServiceProxy);
    router.post('/refresh',userServiceProxy);
    router.post("/review", verifyToken,userServiceProxy);
    router.put("/review/:id", verifyToken,userServiceProxy);
    router.delete("/review/:id", verifyToken,userServiceProxy);
    router.get("/review/my", verifyToken,userServiceProxy);

    export default router;