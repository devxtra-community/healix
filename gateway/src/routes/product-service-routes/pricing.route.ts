import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/requireRole.middleware.js';
import { ROLES } from '../../auth/roles.js';

const route = Router();

const productServiceProxy = createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: (path) => {
    return `/api/v1/product/price${path}`;
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

route.post(
  '/base',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);

route.post(
  '/discount',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);

route.get(
  '/discounts',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);

route.get(
  '/discount/:id',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);

route.put(
  '/discount/:id',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);

route.delete(
  '/discount/:id',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  productServiceProxy,
);

route.post('/apply', verifyToken, productServiceProxy);

route.get('/:productId', productServiceProxy);

export default route;
