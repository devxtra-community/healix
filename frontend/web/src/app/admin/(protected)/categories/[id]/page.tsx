'use client';

import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import CategoryForm from '@/src/components/admin/categories/CategoryForm';

export default function EditCategoryPage() {
  const params = useParams();
  const id = params?.id as string;

  // Mock data fetching - in a real app, you'd fetch based on ID
  const mockData = {
    name: 'Electronics',
    description: 'Gadgets, devices, and accessories',
    status: 'Active',
    icon: '⚡',
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-8 max-w-3xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-gray-500 text-sm mt-0.5">ID: {id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Delete Category"
          >
            <Trash2 size={20} />
          </button>
          <div className="h-6 w-px bg-gray-200 mx-1"></div>
          <Link
            href="/admin/categories"
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:translate-y-[-1px] shadow-lg shadow-black/5 transition-all">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      <CategoryForm initialData={mockData} />
    </div>
  );
}
