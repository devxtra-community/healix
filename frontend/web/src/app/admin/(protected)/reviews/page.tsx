'use client';

import ReviewsTable from '@/src/components/admin/reviews/ReviewsTable';
import { Download } from 'lucide-react';

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-8 pt-2">
      <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage product reviews and feedback
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors max-sm:flex-1">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <ReviewsTable />
    </div>
  );
}
