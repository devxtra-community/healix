import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = Router();
const adminServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: {
    '^/login': '/api/v1/auth/admin/login',
    '^/refresh': '/api/v1/auth/admin/refresh',
    '^/me': '/api/v1/auth/admin/me',
  },
  on: {
    proxyReq(proxyReq, req: Request) {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.sub);
        proxyReq.setHeader('x-user-role', req.user.role);
        proxyReq.setHeader('x-user-type', req.user.type);
      }
    },
  },
});

router.post('/login', adminServiceProxy);
router.post('/refresh', adminServiceProxy);
router.post('/me', adminServiceProxy);

export default router;
