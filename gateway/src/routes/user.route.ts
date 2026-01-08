import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../middleware/auth.middleware.js';
const router = Router();
const userServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: {
    '^/login': '/api/v1/auth/user/login',
    '^/register': '/api/v1/auth/user/register',
    '^/logut': '/api/v1/auth/user/logout',
    '^/profile': '/api/v1/auth/user/profile',
    '^/refresh': '/api/v1/auth/user/refresh',
    '^/me': '/api/v1/auth/user/me',
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

router.post('/login', userServiceProxy);
router.post('/register', userServiceProxy);
router.put('/change_password', verifyToken, userServiceProxy);
router.post('/logout', verifyToken, userServiceProxy);
router.post('/refresh', userServiceProxy);
router.get('/me', verifyToken, userServiceProxy);
router.post('/review', verifyToken, userServiceProxy);
router.put('/review/:id', verifyToken, userServiceProxy);
router.delete('/review/:id', verifyToken, userServiceProxy);
router.get('/review/my', verifyToken, userServiceProxy);

export default router;
