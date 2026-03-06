'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { reviewService } from '@/src/services/review.service';
import { toast } from 'sonner';

export default function AddReviewPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    productId: '',
    rating: 5,
    reviewerGoal: 'weight-loss',
    usagePeriod: '',
    title: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await reviewService.createReview({
        productId: form.productId,
        rating: Number(form.rating),
        reviewerGoal: form.reviewerGoal as
          | 'weight-loss'
          | 'muscle-gain'
          | 'gut-health'
          | 'general-wellness',
        usagePeriod: form.usagePeriod,
        title: form.title,
        description: form.description,
      });

      alert('Review created successfully');
      router.push('/admin/reviews');
    } catch (error: unknown) {
      console.error(error);
      toast.error('Error creating review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-6">
      <h1 className="text-2xl font-bold mb-6">Add Review (Testing)</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4"
      >
        {/* Product ID */}
        <div>
          <label className="block text-sm font-medium mb-1">Product ID</label>
          <input
            name="productId"
            value={form.productId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl bg-gray-50"
            placeholder="Enter product ObjectId"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            name="rating"
            value={form.rating}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl bg-gray-50"
          />
        </div>

        {/* Reviewer Goal */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Reviewer Goal
          </label>
          <select
            name="reviewerGoal"
            value={form.reviewerGoal}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl bg-gray-50"
          >
            <option value="weight-loss">Weight Loss</option>
            <option value="muscle-gain">Muscle Gain</option>
            <option value="gut-health">Gut Health</option>
            <option value="general-wellness">General Wellness</option>
          </select>
        </div>

        {/* Usage Period */}
        <div>
          <label className="block text-sm font-medium mb-1">Usage Period</label>
          <input
            name="usagePeriod"
            value={form.usagePeriod}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl bg-gray-50"
            placeholder="e.g. 2 weeks"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl bg-gray-50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-4 py-2 border rounded-xl bg-gray-50"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Review'}
        </button>
      </form>
    </div>
  );
}
