import express from 'express';
import categoryRoute from './api/routes/category.routes.js';
import { globalErrorHandler } from './api/middlewares/error.middleware.js';
import healthRoute from './api/routes/health.routes.js';
import productRoute from './api/routes/product.routes.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use('/api/v1/category', categoryRoute);
app.use('/health', healthRoute);
app.use('/api/v1/product',productRoute)
app.use(globalErrorHandler);
export default app;
