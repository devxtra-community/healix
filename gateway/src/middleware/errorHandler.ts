import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

interface ErrorWithMessage extends Error {
  message: string;
  stack?: string;
  status?: number;
}

export function errorHandler(
  err: ErrorWithMessage,
  _req: Request,
  res: Response,
  next: NextFunction, // ✅ REQUIRED even if unused
) {
  if (res.headersSent) {
    return next(err);
  }
  logger.error('Unhandled application error', {
    message: err.message,
    stack: err.stack,
  });

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
}
