import { AppError } from './AppError.js';

//Resource doesn’t exist
//ID not found

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}
