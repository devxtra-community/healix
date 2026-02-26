'use client';

import CustomersTable from '@/src/components/admin/customers/CustomersTable';
import { Toaster } from 'sonner';

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-8 pt-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-gray-500 text-sm">Manage your customer base</p>
        </div>
      </div>

      <CustomersTable />

      <Toaster />
    </div>
  );
}
