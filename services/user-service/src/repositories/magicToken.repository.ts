import { Types } from 'mongoose';
import { MagicToken } from '../models/magicToken.model.js';

export class MagicTokenRepository {
  async create(tokenData: {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
  }) {
    return MagicToken.create(tokenData);
  }

  async findValidToken(tokenHash: string) {
    return MagicToken.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() },
    });
  }
  async markUsed(id: Types.ObjectId | string) {
    return MagicToken.findByIdAndUpdate(id, { used: true });
  }
}
