import bcrypt from "bcryptjs";
import { env } from "../config/env.ts";

export const hashPassword = (password: string) => {
  bcrypt.hash(password, env.bcryptSaltRounds);
};

export const comparePassword = async(password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
