'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

import CustomerForm, {
  CustomerFormValues,
} from '@/src/components/admin/customers/CustomerForm';
import { customerService } from '@/src/services/customer.service';
import { Customer } from '@/src/types/api/customer.api';

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomerById(id);
        setCustomer(data);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleUpdate = async (formData: CustomerFormValues) => {
    try {
      setSaving(true);

      await customerService.updateCustomer(id, {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        isActive: formData.status === 'Active',
      });

      router.push('/admin/customers');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this customer?')) return;
    await customerService.deleteCustomer(id);
    router.push('/admin/customers');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Customer not found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-2 pb-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/customers"
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold">Edit Customer</h1>
            <p className="text-gray-500 text-sm">ID: {id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl"
          >
            <Trash2 size={20} />
          </button>

          <button
            onClick={() =>
              document
                .getElementById('customer-form')
                ?.dispatchEvent(
                  new Event('submit', { bubbles: true, cancelable: true }),
                )
            }
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <CustomerForm initialData={customer} onSubmit={handleUpdate} />
    </div>
  );
}
