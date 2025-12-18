import { model } from "mongoose";
import { Document, Schema } from "mongoose";

export interface IUser  {
  name: string;
  email: string;
  password: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  name: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
});

export const User = model<IUser>("User", userSchema)
