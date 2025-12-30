import express from 'express';
import { morganMiddleware } from './config/morgan.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import apiV1 from './routes/index.ts';
import { globalRateLimiter } from './middleware/rateLimit.middleware.ts';
const app = express();
app.use(morganMiddleware);
app.use(globalRateLimiter);

app.get('/health', (_req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
app.use('/api/v1', apiV1);

app.use(errorHandler);

export default app;
