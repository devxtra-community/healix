import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError.js';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const userId = req.header('x-user-id');

  if (!userId) {
    throw new UnauthorizedError('Unauthorized');
  }

  req.auth = {
    id: userId,
    role: req.header('x-user-role') ?? undefined,
  };

  next();
};

export const adminOnly = (req: Request, _res: Response, next: NextFunction) => {
  if (req.auth?.role !== 'admin') {
    throw new UnauthorizedError('Admin only');
  }
  next();
};
