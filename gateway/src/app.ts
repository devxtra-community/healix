import express from 'express';
import cors from 'cors';
import { morganMiddleware } from './config/morgan.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiV1 from './routes/index.js';
import cookieParser from 'cookie-parser';
import { globalRateLimiter } from './middleware/rateLimit.middleware.js';
const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(morganMiddleware);
app.use(globalRateLimiter);

//health
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
