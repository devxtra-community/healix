import { Date, model, Model, Schema, Types } from 'mongoose';
export interface ICategory {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  image?: string;
  category_type: 'nutrition' | 'supplement' | 'vitamin' | 'superfood' | 'herb';
  health_goal: (
    | 'weight-loss'
    | 'muscle-gain'
    | 'immunity'
    | 'gut-health'
    | 'heart-health'
    | 'energy'
  )[];
  is_active: boolean;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}
const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    category_type: {
      type: String,
      enum: ['nutrition', 'supplement', 'vitamin', 'superfood', 'herb'],
    },
    health_goal: {
      type: [String],
      enum: [
        'weight-loss',
        'muscle-gain',
        'immunity',
        'gut-health',
        'heart-health',
        'energy',
      ],
      default: [],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);
CategorySchema.index({ category_type: 1 });
CategorySchema.index({ health_goal: 1 });
export const CategoryModel = model<ICategory>('Category', CategorySchema);
