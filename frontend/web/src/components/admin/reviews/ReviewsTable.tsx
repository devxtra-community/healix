'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Star, Check, X, Trash2 } from 'lucide-react';

const initialReviews = [
  {
    id: 'REV-001',
    product: 'Wireless Noise-Cancelling Headphones',
    customer: 'Alice Johnson',
    rating: 5,
    comment: 'Amazing sound quality and battery life! Highly recommended.',
    date: '2 hours ago',
    status: 'Published',
    avatar: 'AJ',
  },
  {
    id: 'REV-002',
    product: 'Smart Watch Series 7',
    customer: 'Robert Smith',
    rating: 4,
    comment: 'Great watch, but the strap feels a bit cheap.',
    date: '5 hours ago',
    status: 'Pending',
    avatar: 'RS',
  },
  {
    id: 'REV-003',
    product: 'Ergonomic Office Chair',
    customer: 'David Wilson',
    rating: 5,
    comment: 'Best chair I have ever sat in. My back pain is gone.',
    date: '1 day ago',
    status: 'Published',
    avatar: 'DW',
  },
  {
    id: 'REV-004',
    product: 'Coffee Maker Standard',
    customer: 'Maria Garcia',
    rating: 2,
    comment: 'Stopped working after one week. Very disappointed.',
    date: '2 days ago',
    status: 'Rejected',
    avatar: 'MG',
  },
  {
    id: 'REV-005',
    product: 'Running Sneakers',
    customer: 'James Brown',
    rating: 5,
    comment: 'Comfortable and lightweight. Perfect for daily runs.',
    date: '3 days ago',
    status: 'Published',
    avatar: 'JB',
  },
  {
    id: 'REV-006',
    product: 'Cotton T-Shirt',
    customer: 'Linda Davis',
    rating: 3,
    comment: 'Fabric is okay, but sizes run small.',
    date: '4 days ago',
    status: 'Pending',
    avatar: 'LD',
  },
];

export default function ReviewsTable() {
  const [reviews, setReviews] = useState(initialReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-100 text-emerald-600';
      case 'Pending':
        return 'bg-amber-100 text-amber-600';
      case 'Rejected':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const renderStars = (rating: number) => {
    return (
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
  };

  useEffect(() => {
    setReviews(initialReviews);
  }, []);

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100">
      {/* Header Controls */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer font-medium text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <Filter
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReviews.map((review) => (
              <tr
                key={review.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div
                    className="text-sm font-medium text-gray-900 max-w-[200px] truncate"
                    title={review.product}
                  >
                    {review.product}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {review.customer}
                      </div>
                      <div className="text-xs text-gray-500">{review.date}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{renderStars(review.rating)}</td>
                <td className="px-6 py-4">
                  <p
                    className="text-sm text-gray-600 max-w-xs truncate"
                    title={review.comment}
                  >
                    "{review.comment}"
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}
                  >
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X size={18} />
                    </button>
                    <button
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
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

      {/* Pagination Controls */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">1-6</span> of{' '}
          <span className="font-medium text-gray-900">6</span> reviews
        </span>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            disabled
          >
            Previous
          </button>
          <button
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
