'use client';

import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DiscountForm from '@/src/components/admin/discounts/DiscountForm';
import { pricingService } from '@/src/services/price.service';
import { IDiscountForm } from '@/src/types/api/discount.api';

export default function EditDiscountPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [discount, setDiscount] = useState<IDiscountForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDiscount = async () => {
      try {
        const data = await pricingService.getDiscountById(id);
        setDiscount(data);
      } catch {
        alert('Failed to load discount');
        router.push('/admin/discounts');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscount();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('Delete this discount?')) return;

    try {
      await pricingService.deleteDiscount(id);
      router.push('/admin/discounts');
    } catch {
      alert('Failed to delete discount');
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/discounts"
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Discount</h1>
            <p className="text-gray-500 text-sm mt-0.5">ID: {id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Delete Discount"
          >
            <Trash2 size={20} />
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <Link
            href="/admin/discounts"
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Loading discount...
        </div>
      ) : (
        <DiscountForm initialData={discount!} discountId={id} />
      )}
    </div>
  );
}
