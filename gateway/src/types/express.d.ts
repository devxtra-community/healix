import { JwtPayload } from 'jsonwebtoken';

// Define a custom interface for the decoded JWT payload
export interface CustomJwtPayload extends JwtPayload {
  sub: string;
  role: string;
  // Add other user-related properties as needed
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload; // Now it's typed more specifically
    }
  }
}
