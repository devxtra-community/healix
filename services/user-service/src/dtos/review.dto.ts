import { Types } from 'mongoose';
import { ReviewerGoal, AttachmentType } from '../models/review.type.js';

export interface CreateReviewDTO {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  reviewerGoal: ReviewerGoal;
  usagePeriod: string;
  title?: string;
  description?: string;
  attachments?: {
    type: AttachmentType;
    url: string;
  }[];
}

export type UpdateReviewDTO = Partial<
  Omit<CreateReviewDTO, 'productId' | 'userId'>
>;
