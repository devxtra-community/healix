'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Search,
  Edit,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CategoryService } from '@/src/services/category.service';
import { toast } from 'sonner';

interface Category {
  _id: string;
  name: string;
  description?: string;
  category_type: string;
  health_goal: string[];
  is_active: boolean;
}

type metaType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

interface PaginatedResponse {
  data: Category[];
  meta: metaType;
}

export default function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<metaType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response: PaginatedResponse = await CategoryService.getCategories({
        page,
        limit,
        search: searchTerm,
      });

      console.log(response);

      setCategories(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.log(error);
      console.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, searchTerm]);

  const handleDisable = async (id: string) => {
    try {
      await CategoryService.deleteCategory(id);

      setCategories((prev) =>
        prev.map((c) => (c._id === id ? { ...c, is_active: false } : c)),
      );

      toast.success('Category disabled');
    } catch {
      toast.error('Failed to disable category');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await CategoryService.restoreCategory(id);

      setCategories((prev) =>
        prev.map((c) => (c._id === id ? { ...c, is_active: true } : c)),
      );

      toast.success('Category restored');
    } catch {
      toast.error('Failed to restore category');
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="relative max-w-sm w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl"
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{category.name}</td>

                <td className="px-6 py-4 text-sm text-gray-500">
                  {category.description || '-'}
                </td>

                <td className="px-6 py-4 text-sm capitalize">
                  {category.category_type}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      category.is_active
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/categories/${category._id}`}
                      className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition"
                    >
                      <Edit size={18} />
                    </Link>

                    {category.is_active ? (
                      <button
                        onClick={() => handleDisable(category._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(category._id)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      >
                        <RotateCcw size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && (
        <div className="p-6 border-t flex justify-between items-center text-sm">
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={meta.page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              disabled={meta.page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
