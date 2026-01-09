import { model, Schema, Types } from 'mongoose';

export interface IProduct {
  _id: Types.ObjectId;
  category_id: Types.ObjectId;
  current_version_id: Types.ObjectId;
  is_delete: boolean;
  deleted_at: Date;
  created_at: Date;
  updated_at: Date;
}
const ProductSchema = new Schema<IProduct>(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    current_version_id: {
      type: Schema.Types.ObjectId,
      ref: 'ProductVersion',
      required: true,
    },
    is_delete: {
      type: Boolean,
      default: false,
      index: true,
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
ProductSchema.index({ category_id: 1 });
export const ProductModel = model<IProduct>('product', ProductSchema);
