import { AppError } from './AppError.js';

//Duplicate resource
//Unique constraint violation
//Business conflict

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}
