import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/UnauthorizedError.js';

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.header('x-user-id');
  const userRole = req.header('x-user-role');

  if (!userId || userRole !== 'admin') {
    throw new UnauthorizedError('Admin Only');
  }

  req.auth = {
    id: userId,
    role: 'admin',
  };

  next();
};
