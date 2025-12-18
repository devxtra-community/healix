import { AuthService } from "../services/auth.service.ts";
import type { Request, Response } from "express";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    if (!req.body)
      return res.status(400).json({ message: "Request body is required" });

    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken } = await authService.login(
      req.body.email,
      req.body.password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { accessToken } = await authService.refresh(req.cookies.refreshToken);
    res.json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await authService.logout(req.cookies.refreshToken);
    res.clearCookie("refreshToken");
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};
