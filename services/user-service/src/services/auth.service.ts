import { BadRequestError } from '../errors/BadRequestError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { RefreshToken } from '../models/refreshToken.model.js';
import type { IUser } from '../models/user.model.js';
import { MagicTokenRepository } from '../repositories/magicToken.repository.js';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import {
  JWTPayload,
  signAdminAccessToken,
  signAdminRefreshToken,
  signUserAccessToken,
  signUserRefreshToken,
  verifyAdminRefreshToken,
  verifyUserRefreshToken,
} from '../utils/jwt.js';

import { comparePassword, hashPassword } from '../utils/password.js';
import { generateMagicToken } from '../utils/token.js';
import { EmailService } from './email.service.js';
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
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    const link = `${frontendUrl}/magic-login?token=${token}`;
    await this.emailService.sendMagicLink(user.email, link);
  }

  async verifyMagicLink(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const record = await this.magicRepo.findValidToken(tokenHash);

    if (!record) throw new BadRequestError('Invalid or expired link');

    // Mark token as used
    await this.magicRepo.markUsed(record._id);

    const payload: JWTPayload = {
      sub: record.userId.toString(),
      role: 'user',
      type: 'user',
    };
    const accessToken = signUserAccessToken(payload);
    const refreshToken = signUserRefreshToken(payload);

    await this.refreshRepo.create({
      userId: record.userId,
      token: refreshToken,
      type: 'user',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, RefreshToken };
  }

  async register(data: IUser) {
    if (data.provider === 'email' && !data.password) {
      throw new BadRequestError('Password is required');
    }
    data.password = await hashPassword(data.password!);
    return this.userRepo.create(data);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user || !user.isActive)
      throw new UnauthorizedError('The email does not exist');

    if (!user.password) throw new BadRequestError('User password is not set');

    //ROLE CHECK
    if (user.role !== 'user') {
      throw new UnauthorizedError('Use admin login');
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new UnauthorizedError('The password is wrong');

    const payload: JWTPayload = {
      sub: user._id.toString(),
      role: 'user',
      type: 'user',
    };

    const accessToken = signUserAccessToken(payload);
    const refreshToken = signUserRefreshToken(payload);

    await this.refreshRepo.create({
      userId: user._id,
      token: refreshToken,
      type: 'user',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }

  async loginAdmin(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user || !user.isActive)
      throw new UnauthorizedError('Invalid credentials');

    if (!user.password) throw new BadRequestError('User password is not set');

    if (user.role !== 'admin') throw new UnauthorizedError('Not an admin');

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const payload: JWTPayload = {
      sub: user._id.toString(),
      role: 'admin',
      type: 'admin',
    };

    const accessToken = signAdminAccessToken(payload);
    const refreshToken = signAdminRefreshToken(payload);

    await this.refreshRepo.create({
      userId: user._id,
      token: refreshToken,
      type: 'admin',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const stored = await this.refreshRepo.findValid(refreshToken);

    if (!stored) {
      throw new UnauthorizedError('Refresh token revoked or expired');
    }

    const decoded =
      stored.type === 'admin'
        ? verifyAdminRefreshToken(refreshToken)
        : verifyUserRefreshToken(refreshToken);

    if (!decoded?.sub) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const payload = {
      sub: decoded.sub,
      role: decoded.role,
      type: decoded.type,
    };

    const accessToken =
      decoded.type === 'admin'
        ? signAdminAccessToken(payload)
        : signUserAccessToken(payload);

    return { accessToken };
  }

  async me(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError('User is not found');
    }

    return user;
  }

  async logout(refreshToken: string) {
    await this.refreshRepo.revoke(refreshToken);
  }
}
