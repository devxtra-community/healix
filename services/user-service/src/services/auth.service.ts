import { RefreshToken } from '../models/refreshToken.model.ts';
import type { IUser } from '../models/user.model.ts';
import { MagicTokenRepository } from '../repositories/magicToken.repository.ts';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository.ts';
import { UserRepository } from '../repositories/user.repository.ts';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.ts';
import { comparePassword, hashPassword } from '../utils/password.ts';
import { generateMagicToken } from '../utils/token.ts';
import { EmailService } from './email.service.ts';
import crypto from 'crypto';

export class AuthService {
  private userRepo!: UserRepository;
  private refreshRepo!: RefreshTokenRepository;
  private emailService!: EmailService;
  private magicRepo!: MagicTokenRepository;

  constructor(
    userRepo = new UserRepository(),
    refreshRepo = new RefreshTokenRepository(),
    emailService = new EmailService(),
    magicRepo = new MagicTokenRepository(),
  ) {
    this.userRepo = userRepo;
    this.refreshRepo = refreshRepo;
    this.emailService = emailService;
    this.magicRepo = magicRepo;
  }

  //Passwordless login (Magic link) auth

  async requestMagicLink(email: string, frontendUrl: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return;

    //Generate token

    const { token, tokenHash } = generateMagicToken();

    await this.magicRepo.create({
      userId: user._id.toString(),
      tokenHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    const link = `${frontendUrl}/magic-login?token=${token}`;
    await this.emailService.sendMagicLink(user.email, link);
  }

  async verifyMagicLink(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const record = await this.magicRepo.findValidToken(tokenHash);

    if (!record) throw new Error('Invalid or expired link');

    // Mark token as used
    await this.magicRepo.markUsed(record._id);

    const payload = { sub: record.userId, role: 'user' };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await this.refreshRepo.create({
      userId: record.userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, RefreshToken };
  }

  async register(data: IUser) {
    if (!data.password) {
      throw new Error('Password is required');
    }
    data.password = await hashPassword(data.password)!;
    return this.userRepo.create(data);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.isActive) throw new Error('The email does not exist');
    if (!user.password) throw new Error('User password is not set');

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error('The password is wrong');

    const payload = { sub: user._id, role: 'user' };

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
      throw new Error('Invalid refresh token');
    }

    const { sub: userId } = decoded as { sub: string; role: string };
    const stored = await this.refreshRepo.findValid(refreshToken);

    if (!stored) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = signAccessToken({ sub: userId });
    return { accessToken };
  }

  async logout(refreshToken: string) {
    await this.refreshRepo.revoke(refreshToken);
  }
}
