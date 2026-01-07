import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4001),
  mongoUri: process.env.MONGO_URI || '',

  jwt: {
    user: {
      access: {
        secret: process.env.USER_JWT_SECRET!,
        expiresIn:
          (process.env.USER_JWT_EXPIRES_IN as SignOptions['expiresIn']) ||
          '15m',
      },
      refresh: {
        secret: process.env.USER_REFRESH_SECRET!,
        expiresIn:
          (process.env.USER_REFRESH_EXPIRES_IN as SignOptions['expiresIn']) ||
          '7d',
      },
    },

    admin: {
      access: {
        secret: process.env.ADMIN_JWT_SECRET!,
        expiresIn:
          (process.env.ADMIN_JWT_EXPIRES_IN as SignOptions['expiresIn']) ||
          '10m',
      },
      refresh: {
        secret: process.env.ADMIN_REFRESH_SECRET!,
        expiresIn:
          (process.env.ADMIN_REFRESH_EXPIRES_IN as SignOptions['expiresIn']) ||
          '3d',
      },
    },
  },

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
};
