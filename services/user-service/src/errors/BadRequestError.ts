import { AppError } from './AppError.js';

//Missing fields
//Invalid input
//Wrong format

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}
