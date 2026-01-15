import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import {
  setAdminRefreshToken,
  verifyToken,
} from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/requireRole.middleware.js';
import { ROLES } from '../../auth/roles.js';
const router = Router();
const adminServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: (path) => {
    return `/api/v1/auth/admin${path}`;
  },
  on: {
    proxyReq(proxyReq, req: Request) {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.sub);
        proxyReq.setHeader('x-user-role', req.user.role);
        proxyReq.setHeader('x-user-type', req.user.type);
      }

      if (req.token) {
        proxyReq.setHeader('token', req.token);
      }
    },
  },
});

router.post('/login', adminServiceProxy);
router.post('/refresh', setAdminRefreshToken, adminServiceProxy);
router.get('/me', verifyToken, requireRole([ROLES.ADMIN]), adminServiceProxy);

export default router;
