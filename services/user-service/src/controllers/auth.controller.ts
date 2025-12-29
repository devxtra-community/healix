import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.ts";

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
          .json({ success: false, message: "Request body is required" });
      }

      const user = await this.authService.register({
        provider: "email",
        ...req.body,
      });
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  // POST /login
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
      }

      const { accessToken, refreshToken } = await this.authService.login(
        email,
        password
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  };

  // POST /refresh
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(401)
          .json({ success: false, message: "Refresh token missing" });
      }

      const { accessToken } = await this.authService.refresh(refreshToken);
      res.status(200).json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  };

  // POST /logout
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(400)
          .json({ success: false, message: "Refresh token missing" });
      }

      await this.authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  requestMagicLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email } = req.body;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    try {
      await this.authService.requestMagicLink(email, frontendUrl);
      res.status(200).json({
        success: true,
        message: "If the email exists, a magic link has been sent",
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
