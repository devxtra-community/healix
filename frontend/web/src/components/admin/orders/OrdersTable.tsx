'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Eye, Trash2, ArrowUpDown } from 'lucide-react';
import { adminOrderService } from '@/src/services/admin-order.service';
import { AdminOrder } from '@/src/types/api/order.api';
import { toast } from 'sonner';

type StatusFilter =
  | 'All'
  | 'PLACED'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export default function OrdersTable() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [loading, setLoading] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch = (order.orderId ?? '')
      .toLowerCase()
      .includes(normalizedSearch);

    const matchesStatus =
      statusFilter === 'All' || order.fulfillmentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminOrderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-600';
      case 'SHIPPED':
      case 'PACKED':
        return 'bg-blue-100 text-blue-600';
      case 'PLACED':
        return 'bg-amber-100 text-amber-600';
      case 'CANCELLED':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatCurrency = (amount: number, currency?: string) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 2,
    }).format(amount);

  const formatPayment = (order: AdminOrder) => {
    const method = order.paymentMethod || 'N/A';
    return `${method} • ${order.paymentStatus}`;
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
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="All">All Status</option>
              <option value="PLACED">Placed</option>
              <option value="PACKED">Packed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
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
                key={order.orderId}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {order.orderNumber || order.orderId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {order.userId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {formatCurrency(order.totalAmount, order.currency)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {formatPayment(order)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.fulfillmentStatus)}`}
                  >
                    {order.fulfillmentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
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
          Showing{' '}
          <span className="font-medium text-gray-900">
            {filteredOrders.length}
          </span>{' '}
          of <span className="font-medium text-gray-900">{orders.length}</span>{' '}
          orders
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

      {loading && (
        <div className="p-4 text-center text-sm text-gray-400">
          Loading orders...
        </div>
      )}
    </div>
  );
}
