import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const route = Router();
const productServiceProxy = createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL!,
  changeOrigin: true,
  on: {
    // proxyReq(proxyReq, req: any) {},
  },
});
route.use('/', productServiceProxy);
export default route;
