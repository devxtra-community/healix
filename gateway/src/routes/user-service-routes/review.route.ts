import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/requireRole.middleware.js';
import { ROLES } from '../../auth/roles.js';

const router = Router();

const reviewServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: (path) => {
    // Forward to review service base path
    return `/api/v1/reviews${path}`;
  },
  on: {
    proxyReq(proxyReq, req: Request) {
      // Forward user info to review service
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

router.post(
  '/',
  verifyToken,
  requireRole([ROLES.USER, ROLES.ADMIN]),
  reviewServiceProxy,
);
router.patch(
  '/:id',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  reviewServiceProxy,
);
router.delete(
  '/:id',
  verifyToken,
  requireRole([ROLES.USER]),
  reviewServiceProxy,
);
router.get('/products/:productId/reviews', reviewServiceProxy);
router.get('/products/:productId/rating', reviewServiceProxy);

router.get('/', verifyToken, requireRole([ROLES.ADMIN]), reviewServiceProxy);

router.patch(
  '/admin/:id/approve',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  reviewServiceProxy,
);
router.get(
  '/admin/all',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  reviewServiceProxy,
);

export default router;
