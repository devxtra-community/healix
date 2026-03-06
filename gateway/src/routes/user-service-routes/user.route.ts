import { Router, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import {
  setUserRefreshToken,
  verifyToken,
} from '../../middleware/auth.middleware.js';
const router = Router();
const userServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL!,
  changeOrigin: true,
  pathRewrite: (path) => {
    return `/api/v1/auth/user${path}`;
  },
  on: {
    proxyReq(proxyReq, req: Request) {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.sub);
        proxyReq.setHeader('x-user-role', req.user.role);
        proxyReq.setHeader('x-user-type', req.user.type);
      }

      if (req.token) {
        proxyReq.setHeader('token', req.token);
      }
    },
  },
});

// GOOGLE OAUTH ROUTES (no path rewrite)
router.use(
  '/google',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL!,
    changeOrigin: true,
  }),
);

router.post('/login', userServiceProxy);
router.post('/register', userServiceProxy);
router.put('/change_password', verifyToken, userServiceProxy);
router.delete('/logout', verifyToken, userServiceProxy);
router.post('/refresh', setUserRefreshToken, userServiceProxy);
router.get('/me', verifyToken, userServiceProxy);
router.post('/review', verifyToken, userServiceProxy);
router.put('/review/:id', verifyToken, userServiceProxy);
router.delete('/review/:id', verifyToken, userServiceProxy);
router.get('/review/my', verifyToken, userServiceProxy);

export default router;
