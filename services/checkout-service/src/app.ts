import express from 'express';
import { globalErrorHandler } from './api/middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(globalErrorHandler);
export default app;
