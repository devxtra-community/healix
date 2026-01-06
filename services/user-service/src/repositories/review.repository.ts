import { QueryFilter, Types } from 'mongoose';
import { ReviewModel } from '../models/review.model.js';
import { ReviewDocument } from '../models/review.type.js';

export class ReviewRepository {
  //create a new review
  static create(data: Partial<ReviewDocument>) {
    return ReviewModel.create(data);
  }

  //find by id
  static findById(reviewId: string | Types.ObjectId) {
    return ReviewModel.findById(reviewId);
  }

  //find by product and user
  static findByProductAndUser(
    productId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    return ReviewModel.findOne({ productId, userId });
  }

  //find by product
  static findByProduct(
    productId: Types.ObjectId,
    filter: QueryFilter<ReviewDocument> = {},
  ) {
    return ReviewModel.find({ productId, ...filter }).sort({ createdAt: -1 });
  }

  //update by id
  static updateById(reviewId: Types.ObjectId, update: Partial<ReviewDocument>) {
    return ReviewModel.findByIdAndUpdate(reviewId, update, { new: true });
  }

  static deleteById(reviewId: Types.ObjectId) {
    return ReviewModel.findByIdAndDelete(reviewId);
  }

  //paginated reviews by product
  static findPaginatedByProduct(
    productId: Types.ObjectId,
    page = 1,
    limit = 10,
  ) {
    const skip = (page - 1) * limit;

    return Promise.all([
      ReviewModel.find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ReviewModel.countDocuments({ productId }),
    ]);
  }

  /**
   * Average rating for a product
   */
  static getAverageRating(productId: Types.ObjectId) {
    return ReviewModel.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: '$productId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);
  }
}
