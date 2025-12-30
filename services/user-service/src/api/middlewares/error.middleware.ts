import { Request, Response } from 'express';
import { CustomError } from '../../types/express.ts';

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
