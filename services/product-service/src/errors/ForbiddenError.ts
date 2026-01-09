import { AppError } from './AppError.js';

//Logged in but no permission
//User tries admin-only action

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}
