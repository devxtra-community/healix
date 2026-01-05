import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './api/routes/auth.routes.js';
import profileRoutes from './api/routes/profile.routes.js';
import addressRoutes from './api/routes/address.routes.js';
import healthRouter from './api/routes/health.routes.js';
import { globalErrorHandler } from './api/middlewares/error.middleware.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//cors
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/address', addressRoutes);
app.use('/health', healthRouter);

// Add error handler middleware at the end
app.use(globalErrorHandler);

export default app;
