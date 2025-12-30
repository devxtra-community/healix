import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.ts';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error('Unhandled application error', {
    message: err.message,
    stack: err.stack,
  });
  res.status(500).json({
    message: 'Internal server error',
  });
}
