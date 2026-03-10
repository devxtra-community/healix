import { Schema, model, Types } from 'mongoose';

interface IMagicToken {
  userId: Types.ObjectId;
  tokenHash: string;
  purpose: 'magic_link' | 'password_reset';
  expiresAt: Date;
  used: boolean;
}

const MagicTokenSchema = new Schema<IMagicToken>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true },
  purpose: {
    type: String,
    enum: ['magic_link', 'password_reset'],
    default: 'magic_link',
  },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  used: { type: Boolean, default: false },
});

export const MagicToken = model<IMagicToken>('MagicToken', MagicTokenSchema);
