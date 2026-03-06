'use client';

import { useState, useEffect } from 'react';
import { Tag, Calendar, DollarSign, Percent } from 'lucide-react';
import { pricingService } from '@/src/services/price.service';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { IDiscountForm } from '@/src/types/api/discount.api';

interface DiscountFormProps {
  initialData?: IDiscountForm;
  discountId?: string;
}

export default function DiscountForm({
  initialData,
  discountId,
}: DiscountFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    active: true,
    usage_limit: '',
    min_order_value: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        type: initialData.type || 'percentage',
        value: initialData.value?.toString() || '',
        active: initialData.active ?? true,
        usage_limit: initialData.usage_limit?.toString() || '',
        min_order_value: initialData.min_order_value?.toString() || '',
        start_date: initialData.start_date?.slice(0, 10) || '',
        end_date: initialData.end_date?.slice(0, 10) || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.code ||
      !formData.value ||
      !formData.start_date ||
      !formData.end_date
    ) {
      alert('Please complete all required fields');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        code: formData.code,
        type: formData.type as 'percentage' | 'flat',
        value: Number(formData.value),
        usage_limit: formData.usage_limit
          ? Number(formData.usage_limit)
          : undefined,
        min_order_value: formData.min_order_value
          ? Number(formData.min_order_value)
          : undefined,
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
        active: formData.active,
      };

      if (discountId) {
        await pricingService.updateDiscount(discountId, payload);
        toast.success('Discount updated successfully');
      } else {
        await pricingService.createDiscount(payload);
        toast.success('Discount created successfully');
      }

      router.push('/admin/discounts');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Tag size={20} className="text-gray-400" />
            Discount Details
          </h2>

          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Discount Code
              </label>
              <input
                required
                type="text"
                placeholder="e.g. SUMMER25"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl uppercase"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Discount Type
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Discount Value
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {formData.type === 'flat' ? (
                      <DollarSign size={16} />
                    ) : (
                      <Percent size={16} />
                    )}
                  </div>
                  <input
                    required
                    type="number"
                    placeholder={
                      formData.type === 'flat' ? 'e.g. 500' : 'e.g. 20'
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Usage Limit
                </label>
                <input
                  type="number"
                  placeholder="e.g. 100 uses"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  value={formData.usage_limit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usage_limit: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Minimum Order Value
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  value={formData.min_order_value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_order_value: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            Active Period
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Start Date
              </label>
              <input
                required
                type="date"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    start_date: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                End Date
              </label>
              <input
                required
                type="date"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    end_date: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Status</h2>

        <select
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
          value={formData.active ? 'Active' : 'Inactive'}
          onChange={(e) =>
            setFormData({
              ...formData,
              active: e.target.value === 'Active',
            })
          }
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-black text-white py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50"
        >
          {loading
            ? 'Saving...'
            : discountId
              ? 'Update Discount'
              : 'Create Discount'}
        </button>
      </div>

      <Toaster />
    </form>
  );
}
