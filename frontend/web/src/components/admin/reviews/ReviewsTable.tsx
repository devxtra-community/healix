'use client';

import { useEffect, useState } from 'react';
import { Search, Star, Check, X, Trash2 } from 'lucide-react';
import { reviewService } from '@/src/services/review.service';

interface Review {
  _id: string;
  productId: string;
  userId: string;
  title: string;
  userName: string;
  productName: string;
  description: string;
  rating: number;
  reviewerGoal: string;
  usagePeriod: string;
  attachments: [];
  isApproved: boolean;
  isVerifiedPurchase: boolean;
}
export default function ReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getAllReviews(page, limit);
      setReviews(data.data);
      setTotal(data.meta.total);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      await reviewService.updateReviewStatus(id, approved);
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await reviewService.deleteReview(id);
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const status = review.isApproved ? 'Published' : 'Rejected';
    const matchesStatus = statusFilter === 'All' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }
        />
      ))}
    </div>
  );

  const getStatusColor = (approved: boolean) =>
    approved ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600';

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="bg-gray-50 border border-gray-200 py-2.5 px-4 rounded-xl text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Published">Published</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-4 text-left text-xs font-semibold">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold">
                Rating
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold">
                Comment
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredReviews.map((review) => (
              <tr key={review._id}>
                <td className="px-6 py-4 text-sm">{review.productName}</td>
                <td className="px-6 py-4 text-sm">{review.userName}</td>
                <td className="px-6 py-4">{renderStars(review.rating)}</td>
                <td className="px-6 py-4 text-sm max-w-xs truncate">
                  {review.description}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      review.isApproved,
                    )}`}
                  >
                    {review.isApproved ? 'Published' : 'Rejected'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleApprove(review._id, true)}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      <Check size={18} />
                    </button>

                    <button
                      onClick={() => handleApprove(review._id, false)}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
                    >
                      <X size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(review._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-medium text-gray-900">
            {startItem}-{endItem}
          </span>{' '}
          of <span className="font-medium text-gray-900">{total}</span> reviews
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="text-sm font-medium">
            {page} / {totalPages || 1}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
