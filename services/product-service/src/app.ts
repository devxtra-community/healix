import express from 'express';
import categoryRoute from './api/routes/category.routes';
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use('/api/v1/categories', categoryRoute);
export default app;
