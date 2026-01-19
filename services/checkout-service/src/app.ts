import express from 'express';
import { globalErrorHandler } from './api/middlewares/error.middleware.js';
import cartRoute from './api/routes/cart.route.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use((req, _res, next) => {
  console.log('CHECKOUT GOT:', req.method, req.originalUrl);
  next();
});
app.use('/api/v1/cart', cartRoute);

app.use(globalErrorHandler);
export default app;
