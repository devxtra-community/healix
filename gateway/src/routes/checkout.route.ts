import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const route = Router();
const checkoutServiceProxy = createProxyMiddleware({
  target: process.env.CHECKOUT_SERVICE_URL,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req: any) => {},
  },
});
route.use('/', checkoutServiceProxy);
export default route;
