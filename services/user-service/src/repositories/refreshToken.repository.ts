import { IRefreshToken, RefreshToken } from '../models/refreshToken.model.ts';

export class RefreshTokenRepository {
  async create(data: IRefreshToken) {
    return RefreshToken.create(data);
  }

  findValid(token: string) {
    return RefreshToken.findOne({
      token,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });
  }

  revoke(token: string) {
    return RefreshToken.findOneAndUpdate(
      { token },
      { $set: { isRevoked: true } },
    );
  }
}
