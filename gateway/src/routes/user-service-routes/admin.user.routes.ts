import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/requireRole.middleware.js';
import { ROLES } from '../../auth/roles.js';
const router = Router();
const adminServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: (path) => {
    return `/api/v1/admin${path}`;
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

router.get(
  '/users/:id',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  adminServiceProxy,
);
router.put(
  '/users/:id',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  adminServiceProxy,
);
router.get(
  '/users',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  adminServiceProxy,
);
router.patch(
  '/users/:id/toggle',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  adminServiceProxy,
);

export default router;
