'use client';

import Link from 'next/link';

import { useState } from 'react';
import { Search, Filter, Edit, Trash2 } from 'lucide-react';
import { ProductApiResponse } from '@/src/types/api/product.api';

const initialProducts = [
  {
    id: 'PRD-4920',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: '$142.00',
    stock: 45,
    status: 'In Stock',
    image: '🎧',
  },
  {
    id: 'PRD-4921',
    name: 'Smart Watch Series 7',
    category: 'Electronics',
    price: '$340.50',
    stock: 12,
    status: 'Low Stock',
    image: '⌚',
  },
  {
    id: 'PRD-4922',
    name: 'Coffee Maker Standard',
    category: 'Home',
    price: '$85.00',
    stock: 0,
    status: 'Out of Stock',
    image: '☕',
  },
  {
    id: 'PRD-4923',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    price: '$250.00',
    stock: 110,
    status: 'In Stock',
    image: '🪑',
  },
  {
    id: 'PRD-4924',
    name: 'Running Sneakers',
    category: 'Clothing',
    price: '$65.00',
    stock: 32,
    status: 'In Stock',
    image: '👟',
  },
  {
    id: 'PRD-4925',
    name: 'Gaming Keyboard',
    category: 'Electronics',
    price: '$120.25',
    stock: 8,
    status: 'Low Stock',
    image: '⌨️',
  },
  {
    id: 'PRD-4926',
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    price: '$25.00',
    stock: 200,
    status: 'In Stock',
    image: '👕',
  },
  {
    id: 'PRD-4927',
    name: 'Stainless Steel Water Bottle',
    category: 'Accessories',
    price: '$30.00',
    stock: 15,
    status: 'Low Stock',
    image: '🍶',
  },
];

type ProductsTableProps = {
  products: ProductApiResponse[];
};

export default function ProductsTable({ products }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  products.map((product) => console.log(product));

  // const filteredProducts = products.filter((product) => {
  //   const matchesSearch =
  //     product.current_version_id.name
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase()) ||
  //     product._id.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory =
  //     categoryFilter === 'All' || product.category?.name === categoryFilter;
  //   return matchesSearch && matchesCategory;
  // });

  // console.log(filteredProducts);

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

  const categories = [
    'All',
    ...Array.from(new Set(initialProducts.map((p) => p.category))),
  ];

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
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
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
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Stock
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
            {products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                      {/* {product.image} */}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.current_version.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        #{product._id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {product.category?.name}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {product.current_version.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {product.stock?.available} units
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.current_version.status)}`}
                  >
                    {product.current_version.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
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
          Showing <span className="font-medium text-gray-900">1-8</span> of{' '}
          <span className="font-medium text-gray-900">45</span> products
        </span>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            disabled
          >
            Previous
          </button>
          <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
