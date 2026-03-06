import type { NextFunction, Request, Response } from 'express';
import type mongoose from 'mongoose';

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: number;
  keyValue?: Record<string, string | number | boolean>;
  errors?: Record<string, mongoose.Error.ValidatorError>;
}

export const globalErrorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('🔥 FULL ERROR FROM CHECKOUT:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: err.message,
    name: err.name,
  });
};
