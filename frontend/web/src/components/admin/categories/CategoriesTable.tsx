'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';

const initialCategories = [
  {
    id: 'CAT-001',
    name: 'Electronics',
    description: 'Gadgets, devices, and accessories',
    products: 145,
    status: 'Active',
    icon: '⚡',
  },
  {
    id: 'CAT-002',
    name: 'Clothing',
    description: 'Apparel for men and women',
    products: 320,
    status: 'Active',
    icon: '👕',
  },
  {
    id: 'CAT-003',
    name: 'Home & Garden',
    description: 'Furniture, decor, and plants',
    products: 85,
    status: 'Active',
    icon: '🏡',
  },
  {
    id: 'CAT-004',
    name: 'Books',
    description: 'Fiction, non-fiction, and educational',
    products: 540,
    status: 'Active',
    icon: '📚',
  },
  {
    id: 'CAT-005',
    name: 'Sports',
    description: 'Equipment and sportswear',
    products: 62,
    status: 'Active',
    icon: '⚽',
  },
  {
    id: 'CAT-006',
    name: 'Beauty',
    description: 'Makeup, skincare, and fragrance',
    products: 210,
    status: 'Active',
    icon: '💄',
  },
  {
    id: 'CAT-007',
    name: 'Toys',
    description: 'Games and toys for all ages',
    products: 95,
    status: 'Archived',
    icon: '🧸',
  },
];

export default function CategoriesTable() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setCategories(initialCategories);
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
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Products
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
            {filteredCategories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                      {category.icon}
                    </div>
                    <div className="font-medium text-gray-900">
                      {category.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {category.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {category.products} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {category.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls (Static for now) */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">1-7</span> of{' '}
          <span className="font-medium text-gray-900">7</span> categories
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
