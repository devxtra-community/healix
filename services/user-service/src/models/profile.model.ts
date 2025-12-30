import mongoose, { model, Types } from 'mongoose';

export interface IUserProfile {
  _id?: Types.ObjectId;
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  diet_type: 'vegan' | 'vegetarian' | 'keto' | 'paleo' | 'gluten-free' | 'none';
  allergies: string[];
  fitness_goal:
    | 'weight-loss'
    | 'muscle-gain'
    | 'wellness'
    | 'energy'
    | 'gut-health';
  createdAt?: Date;
  updatedAt?: Date;
}

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    age: {
      type: Number,
      min: 0,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    weight: {
      type: Number,
      min: 0,
      required: true,
    },
    height: {
      type: Number,
      min: 0,
      required: true,
    },
    diet_type: {
      type: String,
      enum: ['vegan', 'vegetarian', 'keto', 'paleo', 'gluten-free', 'none'],
      default: 'none',
    },
    allergies: {
      type: [String],
      default: [],
    },
    fitness_goal: {
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'wellness', 'energy', 'gut-health'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserProfileModel = model<IUserProfile>(
  'Profile',
  userProfileSchema,
);
