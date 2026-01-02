import { Request, Response } from 'express';
import logger from '../config/logger.js';

// Define a custom error type (optional)
interface ErrorWithMessage extends Error {
  message: string;
  stack?: string;
}

export function errorHandler(
  err: ErrorWithMessage, // Specify error type
  _req: Request,
  res: Response,
) {
  // Log the error with detailed information
  logger.error('Unhandled application error', {
    message: err.message,
    stack: err.stack,
  });

  // Send the error response
  res.status(500).json({
    message: 'Internal server error',
  });
}
