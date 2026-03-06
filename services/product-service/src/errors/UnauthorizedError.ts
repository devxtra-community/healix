import { AppError } from './AppError.js';

//User not logged in
//Token missing/invalid

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}
