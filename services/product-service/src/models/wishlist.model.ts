import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IWishlistItem {
  product: Types.ObjectId;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface IWishlist extends Document {
  user: Types.ObjectId;
  products: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistItemSchema = new Schema<IWishlistItem>(
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

const wishlistSchema = new Schema<IWishlist>(
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

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
