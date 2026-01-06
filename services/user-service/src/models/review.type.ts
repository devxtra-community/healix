import { Types, Document } from 'mongoose';

export enum ReviewerGoal {
  WEIGHT_LOSS = 'weight-loss',
  MUSCLE_GAIN = 'muscle-gain',
  GUT_HEALTH = 'gut-health',
  GENERAL_WELLNESS = 'general-wellness',
}

export enum AttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface ReviewAttachment {
  type: AttachmentType;
  url: string;
}

export interface ReviewDocument extends Document {
  productId: Types.ObjectId;
  userId: Types.ObjectId;

  rating: number;
  title?: string;
  description?: string;

  reviewerGoal: ReviewerGoal;
  usagePeriod: string;

  attachments: ReviewAttachment[];

  isVerifiedPurchase: boolean;
  isApproved: boolean;

  createdAt: Date;
  updatedAt: Date;
}
