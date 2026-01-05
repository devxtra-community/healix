import type { Request, Response } from 'express';
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
  // _next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Duplicate key
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `${field} already exists`;
  }

  // Validation errors
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
