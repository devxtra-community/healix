import express from 'express';
import categoryRoute from './api/routes/category.routes.js';
import { globalErrorHandler } from './api/middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use('/api/v1/categories', categoryRoute);
app.use(globalErrorHandler);
export default app;
