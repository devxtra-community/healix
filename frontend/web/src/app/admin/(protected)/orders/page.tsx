'use client';

import OrdersTable from '@/src/components/admin/orders/OrdersTable';
import { Download, Plus } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-8 pt-2">
      <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track your customer orders
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors max-sm:flex-1">
            <Download size={18} />
            Export
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:translate-y-[-1px] shadow-lg shadow-black/5 transition-all max-sm:flex-1">
            <Plus size={18} />
            Create Order
          </button>
        </div>
      </div>

      <OrdersTable />
    </div>
  );
}
