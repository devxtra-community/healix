'use client';

import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { Star } from 'lucide-react';
import {
  ProductRatingSummary,
  reviewService,
  ReviewItem,
} from '@/src/services/review.service';
import { authService } from '@/src/services/auth.services';
import { toast } from 'sonner';

type ReviewerGoal =
  | 'weight-loss'
  | 'muscle-gain'
  | 'gut-health'
  | 'general-wellness';

export default function ProductReviews({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [ratingSummary, setRatingSummary] = useState<ProductRatingSummary>({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  // Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [usagePeriod, setUsagePeriod] = useState('< 1 month');
  const [reviewerGoal, setReviewerGoal] =
    useState<ReviewerGoal>('general-wellness');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getProductReviews(productId, 1, 20);
      setReviews(Array.isArray(data?.data) ? data.data : []);

      const summary = await reviewService.getProductRating(productId);
      setRatingSummary({
        averageRating: Number(summary?.averageRating ?? 0),
        totalReviews: Number(summary?.totalReviews ?? 0),
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setRatingSummary({ averageRating: 0, totalReviews: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    let user;

    try {
      const res = await authService.userMe();
      user = res.data;
    } catch {
      toast.error('You must be logged in to leave a review.');
      setSubmitting(false);
      return;
    }

    if (!description || !title) {
      toast.error('Title and description are required');
      setSubmitting(false);
      return;
    }
    try {
      await reviewService.createReview({
        productId,
        userName: user.name || 'Anonymous',
        productName,
        rating,
        title,
        description,
        usagePeriod,
        reviewerGoal,
      });
      toast.success(
        'Review submitted successfully. It will be visible after admin approval.',
      );
      // Reset form
      setRating(5);
      setTitle('');
      setDescription('');
    } catch (error) {
      const message =
        error instanceof AxiosError ? error.response?.data?.message : undefined;

      toast.error(message || 'Failed to submit review. You must be logged in.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-200 fill-gray-200'
          }
        />
      ))}
    </div>
  );

  return (
    <div className="mt-16 bg-white p-8 rounded-xl border">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          {/* Summary */}
          <div className="mb-8 flex items-center gap-4">
            <div className="text-5xl font-bold">
              {ratingSummary.averageRating}
            </div>
            <div>
              {renderStars(Math.round(ratingSummary.averageRating))}
              <div className="text-sm text-gray-500 mt-1">
                Based on {ratingSummary.totalReviews} reviews
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No reviews yet. Be the first to write a review!
              </p>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="border-b pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{r.userName}</h4>
                      {renderStars(r.rating)}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {r.title && (
                    <h5 className="font-medium text-sm mt-2">{r.title}</h5>
                  )}
                  {r.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {r.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit Review */}
        <div>
          <h3 className="text-lg font-bold mb-4">Write a Review</h3>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-gray-50 p-6 rounded-xl"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 fill-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summary of your experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Review</label>
              <textarea
                required
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share your experience..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Primary Goal
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg text-sm bg-white"
                  value={reviewerGoal}
                  onChange={(e) => setReviewerGoal(e.target.value)}
                >
                  <option value="general-wellness">General Wellness</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="gut-health">Gut Health</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Usage Period
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg text-sm bg-white"
                  value={usagePeriod}
                  onChange={(e) => setUsagePeriod(e.target.value)}
                >
                  <option value="< 1 month">Less than 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="> 6 months">More than 6 months</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
