import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/requireRole.middleware.js';
import { ROLES } from '../auth/roles.js';
const router = Router();

const productServiceProxy = createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: {
    '^/': '/api/v1/category/',
    '^/:id': '/api/v1/category/',
    '^/:id/restore': '/api/v1/category/',
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
router.post('/', verifyToken, requireRole([ROLES.ADMIN]), productServiceProxy);
router.get('/', productServiceProxy);
router.get('/:id', productServiceProxy);
router.patch(
  '/:id',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);
router.delete(
  '/:id',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);
router.patch(
  '/:id/restore',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);

export default router;
