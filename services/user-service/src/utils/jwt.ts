import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";

//method for sign access token
export const signAccessToken = (payload: object) => {
  jwt.sign(payload, env.jwt.access.secret!, {
    expiresIn: env.jwt.access.expiresIn,
  });
};

//method for sign refresh token
export const signRefreshToken = (payload: object) => {
  jwt.sign(payload, env.jwt.refresh.secret!, {
    expiresIn: env.jwt.refresh.expiresIn,
  });
};

//methods verify tokens
export const verifyAccessToken = (token: string) => {
  jwt.verify(token, env.jwt.access.secret!);
};

export const verifyRefreshToken = (token: string) => {
  jwt.verify(token, env.jwt.refresh.secret!);
};

