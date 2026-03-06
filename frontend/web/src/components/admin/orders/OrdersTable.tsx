'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Eye, Trash2, ArrowUpDown } from 'lucide-react';

const initialOrders = [
  {
    id: '#ORD-7821',
    customer: 'Alice Johnson',
    date: 'Oct 24, 2023',
    total: '$142.00',
    status: 'Completed',
    payment: 'Mastercard •••• 4242',
  },
  {
    id: '#ORD-7820',
    customer: 'Robert Smith',
    date: 'Oct 24, 2023',
    total: '$340.50',
    status: 'Processing',
    payment: 'Visa •••• 1234',
  },
  {
    id: '#ORD-7819',
    customer: 'Maria Garcia',
    date: 'Oct 23, 2023',
    total: '$85.00',
    status: 'Pending',
    payment: 'PayPal',
  },
  {
    id: '#ORD-7818',
    customer: 'David Wilson',
    date: 'Oct 23, 2023',
    total: '$1,250.00',
    status: 'Completed',
    payment: 'Visa •••• 5678',
  },
  {
    id: '#ORD-7817',
    customer: 'James Brown',
    date: 'Oct 22, 2023',
    total: '$65.00',
    status: 'Cancelled',
    payment: 'Mastercard •••• 9012',
  },
  {
    id: '#ORD-7816',
    customer: 'Linda Davis',
    date: 'Oct 22, 2023',
    total: '$210.25',
    status: 'Completed',
    payment: 'Apple Pay',
  },
  {
    id: '#ORD-7815',
    customer: 'Michael Miller',
    date: 'Oct 21, 2023',
    total: '$45.00',
    status: 'Completed',
    payment: 'Visa •••• 3456',
  },
  {
    id: '#ORD-7814',
    customer: 'Sarah Wilson',
    date: 'Oct 21, 2023',
    total: '$890.00',
    status: 'Processing',
    payment: 'Mastercard •••• 7890',
  },
];

export default function OrdersTable() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setOrders(initialOrders);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-600';
      case 'Processing':
        return 'bg-blue-100 text-blue-600';
      case 'Pending':
        return 'bg-amber-100 text-amber-600';
      case 'Cancelled':
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
            placeholder="Search orders..."
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
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
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
                <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700">
                  Order ID <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Payment
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
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {order.date}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {order.total}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {order.payment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
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
          <span className="font-medium text-gray-900">24</span> orders
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
