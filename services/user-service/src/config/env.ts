import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4001),
  mongoUri: process.env.MONGO_URI || "",

  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn:
        (process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]) ||
        "15m",
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn:
        (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]) ||
        "7d",
    },
  },

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
};
