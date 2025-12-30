import { Schema, model } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
}

const refreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const RefreshToken = model<IRefreshToken>(
  'RefreshToken',
  refreshTokenSchema,
);
