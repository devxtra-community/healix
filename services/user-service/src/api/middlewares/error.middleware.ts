import type { Request, Response } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  stack?: string;
}

export const globalErrorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
