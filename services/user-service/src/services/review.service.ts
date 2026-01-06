import { Types } from 'mongoose';
import { ReviewRepository } from '../repositories/review.repository.js';
import {
  ReviewDocument,
} from '../models/review.type.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { CreateReviewDTO } from '../dtos/review.dto.js';

//Business logic for Reviews

export class ReviewService {
  private reviewRepo;

  constructor(reviewRepo: ReviewRepository) {
    this.reviewRepo = reviewRepo;
  }

  //Create a new review
  async createReview(data: CreateReviewDTO): Promise<ReviewDocument> {
    const existing = await this.reviewRepo.findByProductAndUser(
      data.productId,
      data.userId,
    );

    if (existing) {
      throw new ConflictError('You have already reviewed this product');
    }

    return this.reviewRepo.create({
      ...data,
      attachments: data.attachments ?? [],
    });
  }

  //Update an existing review

  async updateReview(
    reviewId: Types.ObjectId,
    userId: Types.ObjectId,
    update: Partial<ReviewDocument>,
  ): Promise<ReviewDocument | null> {
    const review = await this.reviewRepo.findById(reviewId);

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    //Authorization check
    if (!review.userId.equals(userId)) {
      throw new UnauthorizedError('Not allowed to update this review');
    }

    return this.reviewRepo.updateById(reviewId, update);
  }

  //delete a review
  async deleteReview(
    reviewId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    const review = await this.reviewRepo.findById(reviewId);

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (!review.userId.equals(userId)) {
      throw new NotFoundError('Not allowed to delete this review');
    }

    await this.reviewRepo.deleteById(reviewId);
  }

  //Get reviews for a product (paginated)
  async getProductReviews(productId: Types.ObjectId, page = 1, limit = 10) {
    const [reviews, total] = await this.reviewRepo.findPaginatedByProduct(
      productId,
      page,
      limit,
    );

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  //Get average rating for a product
  async getProductRating(productId: Types.ObjectId) {
    const result = await this.reviewRepo.getAverageRating(productId);

    if (!result.length) {
      return {
        averageRating: 0,
        totalReviews: 0,
      };
    }

    return {
      averageRating: Number(result[0].averageRating.toFixed(1)),
      totalReviews: result[0].totalReviews,
    };
  }
}
