'use client';

import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

import { useParams } from 'next/navigation';
import DiscountForm from '@/src/components/admin/discounts/DiscountForm';

export default function EditDiscountPage() {
  const params = useParams();
  const id = params?.id as string;

  // Mock data fetching
  const mockData = {
    code: 'SUMMER20',
    type: 'Percentage',
    value: '20',
    status: 'Active',
    usageLimit: '100',
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    minOrderValue: '50',
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/discounts"
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Discount</h1>
            <p className="text-gray-500 text-sm mt-0.5">ID: {id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Delete Discount"
          >
            <Trash2 size={20} />
          </button>
          <div className="h-6 w-px bg-gray-200 mx-1"></div>
          <Link
            href="/admin/discounts"
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:-translate-y-px shadow-lg shadow-black/5 transition-all">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      <DiscountForm initialData={mockData} />
    </div>
  );
}
