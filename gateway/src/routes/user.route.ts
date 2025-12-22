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
                    proxyReq.setHeader("x-user-id", req.user.id);
                }
            },
        },
    });

    router.post("/login", userServiceProxy);
    router.post("/register", userServiceProxy);
    router.get("/profile", verifyToken, userServiceProxy);
    router.put("/change_password", verifyToken, userServiceProxy);
    router.put("/update_profile", verifyToken, userServiceProxy);
    router.post("/logout", verifyToken, userServiceProxy);
    router.post('/refresh',userServiceProxy)
    router.post("/review", verifyToken,userServiceProxy);
    router.put("/review/:id", verifyToken,userServiceProxy);
    router.delete("/review/:id", verifyToken,userServiceProxy);
    router.get("/review/my", verifyToken,userServiceProxy);

    export default router;
