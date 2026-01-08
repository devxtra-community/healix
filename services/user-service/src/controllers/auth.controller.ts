import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  private authService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  // POST /register
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return res
          .status(400)
          .json({ success: false, message: 'Request body is required' });
      }

      const user = await this.authService.register({
        provider: 'email',
        ...req.body,
      });
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  // POST /login
  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: 'Email and password are required' });
      }

      const { accessToken, refreshToken } = await this.authService.loginUser(
        email,
        password,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(200).json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  };

  loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await this.authService.loginAdmin(
        email,
        password,
      );

      res.cookie('adminRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/admin',
      });

      res.status(200).json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  };

  // POST /refresh
  refreshUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken);
      if (!refreshToken) {
        return res
          .status(401)
          .json({ success: false, message: 'Refresh token missing' });
      }

      const { accessToken } = await this.authService.refreshUser(refreshToken);
      res.status(200).json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  };

  refreshAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminRefreshToken = req.cookies.adminRefreshToken;
      console.log(adminRefreshToken);
      if (!adminRefreshToken) {
        return res
          .status(401)
          .json({ success: false, message: 'Admin refresh token missing' });
      }

      const { accessToken } =
        await this.authService.refreshAdmin(adminRefreshToken);
      res.status(200).json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await this.authService.me(userId);

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  };

  // POST /logout
  logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(400)
          .json({ success: false, message: 'Refresh token missing' });
      }

      await this.authService.logout(refreshToken);
      res.clearCookie('refreshToken');
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  logoutAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminRefreshToken = req.cookies.adminRefreshToken;
      if (!adminRefreshToken) {
        return res
          .status(400)
          .json({ success: false, message: 'Admin Refresh token missing' });
      }

      await this.authService.logout(adminRefreshToken);
      res.clearCookie('adminRefreshToken');
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  requestMagicLink = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { email } = req.body;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    try {
      await this.authService.requestMagicLink(email, frontendUrl);
      res.status(200).json({
        success: true,
        message: 'If the email exists, a magic link has been sent',
      });
    } catch (error) {
      next(error);
    }
  };

  verifyMagicLink = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    try {
      const tokens = await this.authService.verifyMagicLink(token);
      res.status(200).json({ success: true, ...tokens });
    } catch (error) {
      next(error);
    }
  };
}
