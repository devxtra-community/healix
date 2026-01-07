import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/express.js';

function tryVerify(token: string, secret: string): CustomJwtPayload | null {
  try {
    return jwt.verify(token, secret) as CustomJwtPayload;
  } catch {
    return null;
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  const admin = tryVerify(token, process.env.JWT_ADMIN_ACCESS_SECRET!);
  if (admin) {
    req.user = admin;
    return next();
  }

  const user = tryVerify(token, process.env.JWT_USER_ACCESS_SECRET!);
  if (user) {
    req.user = user;
    return next();
  }

  return res.status(401).json({ message: 'Invalid or expired token' });
}
