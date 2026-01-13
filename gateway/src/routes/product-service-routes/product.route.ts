import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/requireRole.middleware.js';
import { ROLES } from '../../auth/roles.js';

const route = Router();
const productServiceProxy = createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: {
    '^/': '/api/v1/product/',
    '^/:productId': '/api/v1/product/',
    '^/admin/all': '/api/v1/product/',
    '^/:productId/versions': '/api/v1/product/versions',
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
route.get(
  '/admin/all',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);
route.get('/:productId', productServiceProxy);
route.post('/', verifyToken, requireRole([ROLES.ADMIN]), productServiceProxy);
route.post(
  '/:productId/versions',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);
route.get('/', productServiceProxy);
route.delete(
  '/:productId',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);

export default route;
