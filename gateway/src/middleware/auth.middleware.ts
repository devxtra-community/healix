import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Authorization header missing',
    });
  }

  const token = authHeader.split(' ')[1];

  console.log(token);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string,
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
}
