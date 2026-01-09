import 'express';
import { AuthUser } from './auth-user';

declare global {
  namespace Express {
    interface Request {
      auth: AuthUser;
    }
  }
}
