import { Types } from 'mongoose';
import { MagicToken } from '../models/magicToken.model.js';

export class MagicTokenRepository {
  async create(tokenData: {
    userId: Types.ObjectId;
    tokenHash: string;
    purpose: 'magic_link' | 'password_reset';
    expiresAt: Date;
  }) {
    return MagicToken.create(tokenData);
  }

  async findValidToken(
    tokenHash: string,
    purpose: 'magic_link' | 'password_reset',
  ) {
    return MagicToken.findOne({
      tokenHash,
      purpose,
      used: false,
      expiresAt: { $gt: new Date() },
    });
  }

  async markUsed(id: Types.ObjectId | string) {
    return MagicToken.findByIdAndUpdate(id, { used: true });
  }

  async invalidateByUserId(
    userId: Types.ObjectId | string,
    purpose: 'magic_link' | 'password_reset',
  ) {
    return MagicToken.updateMany(
      { userId, purpose, used: false },
      { $set: { used: true } },
    );
  }
}
