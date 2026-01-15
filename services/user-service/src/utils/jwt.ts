import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JWTPayload {
  sub: string;
  role: 'admin' | 'user';
  type: 'admin' | 'user';
}

export function signUserAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_USER_ACCESS_SECRET!, {
    expiresIn: '15m',
    audience: 'user',
    issuer: 'user-service',
  });
}

export function verifyUserAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_USER_ACCESS_SECRET!, {
    audience: 'user',
    issuer: 'user-service',
  }) as JwtPayload;
}

export function signUserRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_USER_REFRESH_SECRET!, {
    expiresIn: '7d',
    audience: 'user',
    issuer: 'user-service',
  });
}

export function verifyUserRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_USER_REFRESH_SECRET!, {
    audience: 'user',
    issuer: 'user-service',
  }) as JwtPayload;
}

export function signAdminAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_ADMIN_ACCESS_SECRET!, {
    expiresIn: '10s',
    audience: 'admin',
    issuer: 'user-service',
  });
}

export function verifyAdminAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_ADMIN_ACCESS_SECRET!, {
    audience: 'admin',
    issuer: 'user-service',
  }) as JwtPayload;
}

export function signAdminRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_ADMIN_REFRESH_SECRET!, {
    expiresIn: '3d',
    audience: 'admin',
    issuer: 'user-service',
  });
}

export function verifyAdminRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_ADMIN_REFRESH_SECRET!, {
    audience: 'admin',
    issuer: 'user-service',
  }) as JwtPayload;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.jwt.user.access.secret!, {
    expiresIn: env.jwt.user.access.expiresIn,
  });
};
