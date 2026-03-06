'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, Filter, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { customerService } from '@/src/services/customer.service';
import { toast } from 'sonner';
import { Customer } from '@/src/types/api/customer.api';

interface PaginatedResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CustomersTable() {
  const [customers, setCustomers] = useState<PaginatedResponse | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Active' | 'Blocked'
  >('All');
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await customerService.getAllCustomersAdmin({
        page,
        limit,
        search: searchTerm || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });

      console.log(res);

      setCustomers(res);
    } catch (err) {
      console.log(err);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm, statusFilter]);

  const handleToggleStatus = async (id: string) => {
    try {
      await customerService.toggleCustomerStatus(id);
      toast.success('Customer status updated');
      fetchCustomers();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-emerald-100 text-emerald-600'
      : 'bg-red-100 text-red-600';
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
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer font-medium text-sm"
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value as 'All' | 'Active' | 'Blocked');
              }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
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
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Joined
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
            {customers?.data?.map((customer: Customer) => (
              <tr
                key={customer._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                      {customer.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        #{customer._id.slice(-6)}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Mail size={12} />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone size={12} />
                      {customer.phone || '-'}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(customer.createdAt).toDateString()}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      customer.isActive,
                    )}`}
                  >
                    {customer.isActive ? 'Active' : 'Blocked'}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleStatus(customer._id)}
                      className="px-3 py-1.5 text-xs border rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {customer.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    <Link
                      href={`/admin/customers/${customer._id}`}
                      className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {customers && (
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing page{' '}
            <span className="font-medium text-gray-900">{customers.page}</span>{' '}
            of{' '}
            <span className="font-medium text-gray-900">
              {customers.totalPages}
            </span>
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={customers.page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>

            <button
              disabled={customers.page === customers.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="p-4 text-center text-sm text-gray-400">
          Loading customers...
        </div>
      )}
    </div>
  );
}
