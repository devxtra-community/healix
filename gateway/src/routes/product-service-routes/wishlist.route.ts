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
    return `/api/v1/wishlist${path}`;
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

route.get('/', verifyToken, requireRole([ROLES.USER]), productServiceProxy);

route.post('/', verifyToken, requireRole([ROLES.USER]), productServiceProxy);

route.delete(
  '/:productId',
  verifyToken,
  requireRole([ROLES.USER]),
  productServiceProxy,
);

route.patch(
  '/clear',
  verifyToken,
  requireRole([ROLES.USER]),
  productServiceProxy,
);

export default route;
