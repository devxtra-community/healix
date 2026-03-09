import express from 'express';
import { globalErrorHandler } from './api/middlewares/error.middleware.js';
import cartRoute from './api/routes/cart.route.js';
import checkoutRoute from './api/routes/checkout.route.js';
import webhookRoutes from './api/routes/webhook.route.js';
import orderRoute from './api/routes/order.route.js';
import { releaseExpiredReservations } from './utils/releaseExpiredReservations.js';
import analyticsRoutes from './analytics/analytics.routes.js';

const app = express();
//stripe webhook
app.use(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  webhookRoutes,
);
// background job

setInterval(
  async () => {
    try {
      await releaseExpiredReservations();
    } catch (err) {
      console.error('Reservation cleanup failed', err);
    }
  },
  5 * 60 * 1000,
);

app.use(express.json());
app.use(express.urlencoded());

//Logger

app.use((req, _res, next) => {
  console.log('CHECKOUT GOT:', req.method, req.originalUrl);
  next();
});

//route

app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/checkout', checkoutRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/analytics', analyticsRoutes);

//error handler

app.use(globalErrorHandler);

export default app;
