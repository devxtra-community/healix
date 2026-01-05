import { model, Types } from 'mongoose';
import { Schema } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;

  password?: string;
  provider: 'google' | 'email';

  google_id?: string;
  email_verified?: boolean;
  role: 'user' | 'admin';

  avatar?: string;
  phone?: string;
  isActive: boolean;
  last_login?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === 'email'; // ✅ important
      },
    },

    provider: {
      type: String,
      enum: ['google', 'email'],
      required: true,
    },

    google_id: {
      type: String,
      unique: true,
      sparse: true,
    },

    email_verified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    avatar: { type: String },
    phone: { type: String },

    isActive: { type: Boolean, default: true },
    last_login: { type: Date, default: null },
  },
  { timestamps: true },
);

// Ensure fast queries for admin dashboards or role-based queries
userSchema.index({ role: 1 });
userSchema.index({ role: 1, isActive: 1 }); // active admins/users
userSchema.index({ last_login: -1 }); // sorting by recent login

export const User = model<IUser>('User', userSchema);
