import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../../middleware/auth.middleware.js';
import { ROLES } from '../../auth/roles.js';
import { requireRole } from '../../middleware/requireRole.middleware.js';
const route = Router();
const orderServiceProxy = createProxyMiddleware({
  target: process.env.CHECKOUT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => {
    return `/api/v1/order${path === '/' ? '' : path}`;
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
route.get('/', verifyToken, requireRole([ROLES.USER]), orderServiceProxy);
route.get(
  '/:orderId',
  verifyToken,
  requireRole([ROLES.USER]),
  orderServiceProxy,
);
route.post(
  '/:orderId/cancel',
  verifyToken,
  requireRole([ROLES.USER]),
  orderServiceProxy,
);
route.post(
  '/:orderId/pay',
  verifyToken,
  requireRole([ROLES.USER]),
  orderServiceProxy,
);

route.get(
  '/admin/all',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  orderServiceProxy,
);
route.patch(
  '/:orderId/status',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  orderServiceProxy,
);
route.post(
  '/:orderId/sync-payment',
  verifyToken,
  requireRole([ROLES.USER]),
  orderServiceProxy,
);
export default route;
