import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/requireRole.middleware.js';
import { ROLES } from '../auth/roles.js';
const router = Router();

const userServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: {
    '^/': '/api/v1/address/',
  },
  on: {
    proxyReq(proxyReq, req: Request) {
      const userId = req.user?.sub;

      if (!userId) {
        console.error('x-user-id missing in gateway');
        return;
      }

      proxyReq.setHeader('x-user-id', userId);
    },
  },
});
router.get('/', verifyToken, requireRole([ROLES.USER]), userServiceProxy);
router.put('/', verifyToken, requireRole([ROLES.USER]), userServiceProxy);
router.post('/', verifyToken, requireRole([ROLES.USER]), userServiceProxy);
router.delete('/', verifyToken, requireRole([ROLES.USER]), userServiceProxy);

export default router;
