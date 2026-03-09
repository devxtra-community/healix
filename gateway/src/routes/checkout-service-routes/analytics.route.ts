import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/requireRole.middleware.js';
import { ROLES } from '../../auth/roles.js';

const route = Router();

const analyticsProxy = createProxyMiddleware({
  target: process.env.CHECKOUT_SERVICE_URL,
  changeOrigin: true,

  pathRewrite: (path) => {
    return `/api/v1/analytics${path === '/' ? '' : path}`;
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

/*
  ADMIN ANALYTICS ROUTES
*/

route.get(
  '/dashboard',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  analyticsProxy,
);

route.get('/overview', verifyToken, requireRole([ROLES.ADMIN]), analyticsProxy);

route.get('/revenue', verifyToken, requireRole([ROLES.ADMIN]), analyticsProxy);

route.get('/cart', verifyToken, requireRole([ROLES.ADMIN]), analyticsProxy);

route.get(
  '/products/top',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  analyticsProxy,
);

route.get(
  '/products/views',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  analyticsProxy,
);

route.get(
  '/products/revenue',
  verifyToken,
  requireRole([ROLES.ADMIN]),
  analyticsProxy,
);

route.get('/funnel', verifyToken, requireRole([ROLES.ADMIN]), analyticsProxy);

route.get('/growth', verifyToken, requireRole([ROLES.ADMIN]), analyticsProxy);

/*
  PUBLIC ANALYTICS ROUTE
  (product view tracking)
*/

route.post('/product-view', analyticsProxy);

export default route;
