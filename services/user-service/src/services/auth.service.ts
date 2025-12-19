import type { IUser } from "../models/user.model.ts";
import { RefreshTokenRepository } from "../repositories/refreshToken.repository.ts";
import { UserRepository } from "../repositories/user.repository.ts";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.ts";
import { comparePassword, hashPassword } from "../utils/password.ts";

export class AuthService {
  private userRepo!: UserRepository;
  private refreshRepo!: RefreshTokenRepository;

  constructor(
    userRepo = new UserRepository(),
    refreshRepo = new RefreshTokenRepository()
  ) {
    this.userRepo = userRepo;
    this.refreshRepo = refreshRepo;
  }

  async register(data: IUser) {
    data.password = await hashPassword(data.password)!;
    return this.userRepo.create(data);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.isActive) throw new Error("Unauthorized");

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error("Unauthorized");

    const payload = { sub: user._id };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await this.refreshRepo.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded?.sub) {
      throw new Error("Invalid refresh token");
    }

    const { sub: userId } = decoded as { sub: string };

    const stored = await this.refreshRepo.findValid(refreshToken);

    if (!stored) {
      throw new Error("Invalid refresh token");
    }

    const accessToken = signAccessToken({ sub: userId });

    return { accessToken };
  }

  async logout(refreshToken: string) {
    await this.refreshRepo.revoke(refreshToken);
  }
}
