'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Filter, Edit, Trash2 } from 'lucide-react';
import { ProductApiResponse } from '@/src/types/api/product.api';

type ProductsTableProps = {
  products: ProductApiResponse[];
  onDelete: (id: string) => void;
};

const S3_BASE = 'https://healix-product-images.s3.ap-south-1.amazonaws.com/';

type ProductVersionLike = {
  _id?: string;
  name?: string;
  price?: number;
  images?: string[];
  status?: string;
};

function resolveImage(src?: string | null) {
  if (!src) return '/placeholder.png';
  if (src.startsWith('http')) return src;
  return `${S3_BASE}${src}`;
}

function getCurrentVersion(product: ProductApiResponse): ProductVersionLike {
  if (product.current_version && typeof product.current_version === 'object') {
    return product.current_version;
  }

  if (
    product.current_version_id &&
    typeof product.current_version_id === 'object' &&
    !Array.isArray(product.current_version_id)
  ) {
    return product.current_version_id;
  }

  return {};
}

export default function ProductsTable({
  products,
  onDelete,
}: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-100 text-emerald-600';
      case 'Low Stock':
        return 'bg-amber-100 text-amber-600';
      case 'Out of Stock':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Optional filtering
  const filteredProducts = products.filter((product) => {
    const currentVersion = getCurrentVersion(product);
    const matchesSearch =
      (currentVersion.name ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' || product.category?.name === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    'All',
    ...Array.from(new Set(products.map((p) => p.category?.name || 'Unknown'))),
  ];

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer font-medium text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat} Categories
              </option>
            ))}
          </select>

          <Filter
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => {
              const currentVersion = getCurrentVersion(product);
              const image = currentVersion.images?.[0];
              const status = currentVersion.status ?? 'Unknown';
              const productId =
                typeof product._id === 'string' ? product._id : '';

              return (
                <tr
                  key={productId || `${currentVersion.name ?? 'product'}-row`}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                        {image && (
                          <img
                            src={resolveImage(image)}
                            alt={currentVersion.name ?? 'Product'}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {currentVersion.name ?? 'Unknown product'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {productId ? `#${productId}` : '#N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.category?.name}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${currentVersion.price ?? 0}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.stock?.available} units
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        status,
                      )}`}
                    >
                      {status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${productId}/edit`}
                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </Link>

                      <button
                        onClick={() => productId && onDelete(productId)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
