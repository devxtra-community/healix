import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, env.bcryptSaltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
