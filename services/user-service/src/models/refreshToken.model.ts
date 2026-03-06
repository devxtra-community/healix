import { Schema, Types, model } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  token: string;
  type: 'user' | 'admin';
  expiresAt: Date;
  isRevoked: boolean;
}

const refreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },

    type: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
      index: true,
    },

    expiresAt: { type: Date, required: true, index: true },
    isRevoked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const RefreshToken = model<IRefreshToken>(
  'RefreshToken',
  refreshTokenSchema,
);
