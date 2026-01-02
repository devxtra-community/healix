import { Types } from 'mongoose';
import { RefreshToken } from '../models/refreshToken.model.js';

export class RefreshTokenRepository {
  async create(data: {
    userId: Types.ObjectId;
    token: string;
    expiresAt: Date;
  }) {
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
