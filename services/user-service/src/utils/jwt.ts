import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

//method for sign access token
export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, env.jwt.access.secret!, {
    expiresIn: env.jwt.access.expiresIn,
  });
};

//method for sign refresh token
export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, env.jwt.refresh.secret!, {
    expiresIn: env.jwt.refresh.expiresIn,
  });
};

//methods verify tokens
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwt.access.secret!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.jwt.refresh.secret!);
};

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.jwt.access.secret!, {
    expiresIn: env.jwt.access.expiresIn,
  });
};
