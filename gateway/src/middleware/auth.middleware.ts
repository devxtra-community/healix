import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/express.js';

export function extractAccessToken(req: Request) {
  // Web
  if (req.cookies?.accessToken) {
    return {
      token: req.cookies.accessToken,
      source: 'web' as const,
    };
  }

  if (req.cookies?.adminAccessToken) {
    return {
      token: req.cookies.adminAccessToken,
      source: 'web' as const,
    };
  }

  // Mobile
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return {
      token: authHeader.split(' ')[1],
      source: 'mobile' as const,
    };
  }

  return null;
}

function tryVerify(token: string, secret: string): CustomJwtPayload | null {
  try {
    return jwt.verify(token, secret) as CustomJwtPayload;
  } catch {
    return null;
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const extracted = extractAccessToken(req);
  if (!extracted) return res.sendStatus(401);

  // Try USER token
  const userPayload = tryVerify(
    extracted.token,
    process.env.JWT_USER_ACCESS_SECRET!,
  );

  if (userPayload) {
    req.user = userPayload;
    req.clientType = extracted.source;
    req.authType = 'user';
    return next();
  }

  // Try ADMIN token
  const adminPayload = tryVerify(
    extracted.token,
    process.env.JWT_ADMIN_ACCESS_SECRET!,
  );

  if (adminPayload) {
    req.user = adminPayload;
    req.clientType = extracted.source;
    req.authType = 'admin';
    return next();
  }

  // Token invalid for both
  return res.sendStatus(401);
}

export function setAdminRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res
      .status(400)
      .json({ status: false, message: 'Must need refresh token' });
  }

  if (req.path.startsWith('/refresh')) {
    req.token = req.cookies.adminRefreshToken;
    return next();
  } else {
    req.token = req.cookies.refreshToken;
    return next();
  }
}

export function setUserRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'User refresh token missing',
    });
  }

  req.token = token;
  req.authType = 'user';

  next();
}
