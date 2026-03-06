import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/requireRole.middleware.js';
import { ROLES } from '../../auth/roles.js';

const route = Router();
const checkoutServiceProxy = createProxyMiddleware({
  target: process.env.CHECKOUT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/': '/api/v1/checkout/',
  },
  on: {
    proxyReq(proxyReq, req: Request) {
      const userId = req.user?.sub;
      const userRole = req.user?.role;

      if (!userId || !userRole) return;

      proxyReq.setHeader('x-user-id', userId);
      proxyReq.setHeader('x-user-role', userRole);
    },
  },
});
route.post('/', verifyToken, requireRole([ROLES.USER]), checkoutServiceProxy);
export default route;
