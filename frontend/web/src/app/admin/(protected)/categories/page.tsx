import Link from 'next/link';
import { Plus } from 'lucide-react';
import CategoriesTable from '@/src/components/admin/categories/CategoriesTable';

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-8 pt-2">
      <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">
            Organize your products into categories
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Link
            href="/admin/categories/add"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:translate-y-[-1px] shadow-lg shadow-black/5 transition-all w-full sm:w-auto"
          >
            <Plus size={18} />
            Add Category
          </Link>
        </div>
      </div>

      <CategoriesTable />
    </div>
  );
}
