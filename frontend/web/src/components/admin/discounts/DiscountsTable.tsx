'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, Filter, Edit, Trash2, Tag, Calendar } from 'lucide-react';
import { pricingService } from '@/src/services/price.service';
import { toast } from 'sonner';

interface Discount {
  _id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  usage_limit?: number;
  used_count: number;
  min_order_value?: number;
  start_date: string;
  end_date: string;
  active: boolean;
}

export default function DiscountsTable() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const data = await pricingService.getAllDiscounts();
      setDiscounts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discount?')) return;
    await pricingService.deleteDiscount(id);
    toast.success('Discount code deleted successfully');
    fetchDiscounts();
  };

  const getStatus = (discount: Discount) => {
    const now = new Date();
    const start = new Date(discount.start_date);
    const end = new Date(discount.end_date);

    if (!discount.active) return 'Inactive';
    if (now < start) return 'Scheduled';
    if (now > end) return 'Expired';
    return 'Active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Inactive':
        return 'bg-red-100 text-red-600';
      case 'Active':
        return 'bg-emerald-100 text-emerald-600';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-600';
      case 'Expired':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredDiscounts = discounts.filter((discount) => {
    const status = getStatus(discount);
    const matchesSearch = discount.code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search coupons..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <select
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer font-medium text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Expired">Expired</option>
          </select>
          <Filter
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Type & Value
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date Range
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Loading discounts...
                </td>
              </tr>
            ) : filteredDiscounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No discounts found
                </td>
              </tr>
            ) : (
              filteredDiscounts.map((discount) => {
                const status = getStatus(discount);

                return (
                  <tr
                    key={discount._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <Tag size={16} />
                        </div>
                        <div className="text-sm font-bold text-gray-900 font-mono">
                          {discount.code}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          status,
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {discount.type === 'percentage'
                            ? `${discount.value}%`
                            : `₹${discount.value}`}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {discount.type}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {discount.used_count}/{discount.usage_limit ?? '∞'}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(
                        discount.start_date,
                      ).toLocaleDateString()} –{' '}
                      {new Date(discount.end_date).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/discounts/${discount._id}`}
                          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </Link>

                        <button
                          onClick={() => handleDelete(discount._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-gray-100 text-sm text-gray-500">
        Total Discounts: {filteredDiscounts.length}
      </div>
    </div>
  );
}
