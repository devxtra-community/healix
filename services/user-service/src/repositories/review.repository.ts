import { QueryFilter, Types } from 'mongoose';
import { ReviewModel } from '../models/review.model.js';
import { ReviewDocument } from '../models/review.type.js';

export class ReviewRepository {
  //create a new review
  create(data: Partial<ReviewDocument>) {
    return ReviewModel.create(data);
  }

  //find by id
  findById(reviewId: string | Types.ObjectId) {
    return ReviewModel.findById(reviewId);
  }

  //find by product and user
  findByProductAndUser(productId: Types.ObjectId, userId: Types.ObjectId) {
    return ReviewModel.findOne({ productId, userId });
  }

  //find by product
  findByProduct(
    productId: Types.ObjectId,
    filter: QueryFilter<ReviewDocument> = {},
  ) {
    return ReviewModel.find({ productId, ...filter }).sort({ createdAt: -1 });
  }

  //update by id
  updateById(reviewId: Types.ObjectId, update: Partial<ReviewDocument>) {
    return ReviewModel.findByIdAndUpdate(reviewId, update, { new: true });
  }

  deleteById(reviewId: Types.ObjectId) {
    return ReviewModel.findByIdAndDelete(reviewId);
  }

  //paginated reviews by product
  findPaginatedByProduct(productId: Types.ObjectId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return Promise.all([
      ReviewModel.find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ReviewModel.countDocuments({ productId }),
    ]);
  }

  //average rating for a product
  getAverageRating(productId: Types.ObjectId) {
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
