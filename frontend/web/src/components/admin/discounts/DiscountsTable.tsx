'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, Filter, Edit, Trash2, Tag, Calendar } from 'lucide-react';

const initialDiscounts = [
  {
    id: 'DSC-001',
    code: 'SUMMER20',
    type: 'Percentage',
    value: '20%',
    status: 'Active',
    usage: '45/100',
    date: 'Jun 1 - Aug 31',
    minOrder: '$50.00',
  },
  {
    id: 'DSC-002',
    code: 'WELCOME10',
    type: 'Percentage',
    value: '10%',
    status: 'Active',
    usage: '120/500',
    date: 'Always Active',
    minOrder: '$0.00',
  },
  {
    id: 'DSC-003',
    code: 'FLASHSALE',
    type: 'Fixed',
    value: '$15.00',
    status: 'Expired',
    usage: '100/100',
    date: 'Oct 24 - Oct 25',
    minOrder: '$100.00',
  },
  {
    id: 'DSC-004',
    code: 'BLACKFRIDAY',
    type: 'Percentage',
    value: '50%',
    status: 'Scheduled',
    usage: '0/1000',
    date: 'Nov 24 - Nov 27',
    minOrder: '$200.00',
  },
  {
    id: 'DSC-005',
    code: 'FREESHIP',
    type: 'Fixed',
    value: 'Free Ship',
    status: 'Active',
    usage: '32/200',
    date: 'Oct 1 - Oct 31',
    minOrder: '$75.00',
  },
];

export default function DiscountsTable() {
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredDiscounts = discounts.filter((discount) => {
    const matchesSearch = discount.code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || discount.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setDiscounts(initialDiscounts);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
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
            placeholder="Search coupons..."
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
      </div>

      {/* Table */}
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
            {filteredDiscounts.map((discount) => (
              <tr
                key={discount.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                      <Tag size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 font-mono">
                        {discount.code}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(discount.status)}`}
                  >
                    {discount.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {discount.value}
                    </div>
                    <div className="text-xs text-gray-500">{discount.type}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {discount.usage}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1.5">
                  <Calendar size={14} />
                  {discount.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/discounts/${discount.id}`}
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

      {/* Pagination Controls */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">1-5</span> of{' '}
          <span className="font-medium text-gray-900">5</span> coupons
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
