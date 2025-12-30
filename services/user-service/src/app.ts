import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './api/routes/auth.routes.ts';
import profileRoutes from './api/routes/profile.routes.ts';
import { globalErrorHandler } from './api/middlewares/error.middleware.ts';
import healthRouter from './api/routes/health.routes.ts';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/health', healthRouter);

app.use(globalErrorHandler);

export default app;
