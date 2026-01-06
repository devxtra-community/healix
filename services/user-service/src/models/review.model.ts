import { Schema, model, Types } from 'mongoose';
import {
  ReviewDocument,
  ReviewerGoal,
  AttachmentType,
} from './review.type.js';

const attachmentSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(AttachmentType),
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const reviewSchema = new Schema<ReviewDocument>(
  {
    productId: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },

    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    reviewerGoal: {
      type: String,
      enum: Object.values(ReviewerGoal),
      required: true,
    },

    usagePeriod: {
      type: String,
      required: true,
      trim: true,
    },

    attachments: {
      type: [attachmentSchema],
      default: [],
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple reviews by same user for same product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export const ReviewModel = model<ReviewDocument>('Review', reviewSchema);
