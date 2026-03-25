import mongoose, { Schema } from 'mongoose';
const wishlistItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);
const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    products: {
      type: [wishlistItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);
wishlistSchema.index({ user: 1 });
export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
