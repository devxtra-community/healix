import { Router, Request } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/requireRole.middleware.js";
import { ROLES } from "../../auth/roles.js";

const route = Router();

const cartProxy = createProxyMiddleware({
  target: process.env.CHECKOUT_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: {
    '^/': '/api/v1/cart/',
    '^/:productId/:varitentId':'/api/v1/cart/'
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


route.get('/', verifyToken,requireRole([ROLES.USER]),cartProxy);
route.post('/', verifyToken,requireRole([ROLES.USER]),cartProxy);
route.delete('/:productId/:variantId', verifyToken, requireRole([ROLES.USER]),cartProxy);
route.delete('/', verifyToken, requireRole([ROLES.USER]),cartProxy);

export default route