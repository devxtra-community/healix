import { model, Schema } from 'mongoose';
const ProductSchema = new Schema(
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
      default: null,
      //required: true
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
export const ProductModel = model('Product', ProductSchema);
