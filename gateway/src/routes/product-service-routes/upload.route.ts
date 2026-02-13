import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = Router();

const uploadProxy = createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: {
    '^/': '/api/v1/products/',
  },
});

// router.post('/generate-upload-url', uploadProxy);
router.post(
  '/generate-upload-url',
  (req, res, next) => {
    console.log('🔥 Gateway upload route hit');
    next();
  },
  uploadProxy,
);

export default router;
