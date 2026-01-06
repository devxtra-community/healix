import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { ReviewerGoal, AttachmentType } from '../models/review.type.js';
import { ReviewService } from '../services/review.service.js';

export class ReviewController {
  private reviewService;

  constructor(reviewService: ReviewService) {
    this.reviewService = reviewService;
  }

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = new Types.ObjectId(req.auth.id);

      const review = await this.reviewService.createReview({
        productId: new Types.ObjectId(req.body.productId),
        userId,
        rating: req.body.rating,
        reviewerGoal: req.body.reviewerGoal as ReviewerGoal,
        usagePeriod: req.body.usagePeriod,
        title: req.body.title,
        description: req.body.description,
        attachments: req.body.attachments as {
          type: AttachmentType;
          url: string;
        }[],
      });

      res.status(201).json({
        message: 'Review created successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = new Types.ObjectId(req.params.id);
      const userId = new Types.ObjectId(req.auth.id);

      const updated = await this.reviewService.updateReview(
        reviewId,
        userId,
        req.body,
      );

      res.status(200).json({
        message: 'Review updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = new Types.ObjectId(req.params.id);
      const userId = new Types.ObjectId(req.auth.id);

      await this.reviewService.deleteReview(reviewId, userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getProductReviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const productId = new Types.ObjectId(req.params.productId);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.reviewService.getProductReviews(
        productId,
        page,
        limit,
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProductRating = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const productId = new Types.ObjectId(req.params.productId);

      const rating = await this.reviewService.getProductRating(productId);

      res.status(200).json(rating);
    } catch (error) {
      next(error);
    }
  };
}
