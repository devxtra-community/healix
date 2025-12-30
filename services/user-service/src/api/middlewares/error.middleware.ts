import type { Response } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  stack?: string;
}

export const globalErrorHandler = (err: CustomError, res: Response) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // If it's a development environment, include stack trace (for easier debugging)
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
    });
  }

  // In production, do not leak sensitive information like the stack trace
  res.status(statusCode).json({
    success: false,
    message,
  });

  // Log the error for debugging purposes (could be sent to a logging service)
  console.error(`[${new Date().toISOString()}] ${message}`, err.stack);
};
