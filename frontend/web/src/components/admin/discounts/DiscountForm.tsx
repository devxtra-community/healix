'use client';

import { useState, useEffect } from 'react';
import { Tag, Calendar, DollarSign, Percent, Clock } from 'lucide-react';

interface DiscountFormProps {
  initialData?: {
    code: string;
    type: string;
    value: string;
    status: string;
    usageLimit: string;
    startDate: string;
    endDate: string;
    minOrderValue: string;
  };
}

export default function DiscountForm({ initialData }: DiscountFormProps) {
  const [formData, setFormData] = useState({
    code: '',
    type: 'Percentage',
    value: '',
    status: 'Active',
    usageLimit: '',
    startDate: '',
    endDate: '',
    minOrderValue: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  return (
    <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Info */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Tag size={20} className="text-gray-400" />
            Discount Details
          </h2>
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Discount Code
              </label>
              <input
                type="text"
                placeholder="e.g. SUMMER2024"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all uppercase font-medium placeholder:normal-case"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Customers will enter this code at checkout.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Discount Type
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Value
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {formData.type === 'Fixed' ? (
                      <DollarSign size={16} />
                    ) : (
                      <Percent size={16} />
                    )}
                  </div>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Usage Limit
                </label>
                <input
                  type="number"
                  placeholder="Total number of uses"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Minimum Order Value
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <DollarSign size={16} />
                  </div>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    value={formData.minOrderValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderValue: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            Active Dates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Status */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
          <div className="flex flex-col gap-4">
            <select
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Expired">Expired</option>
            </select>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                Summary
              </h4>
              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  Code:{' '}
                  <span className="font-mono text-gray-900 font-medium">
                    {formData.code || '...'}
                  </span>
                </p>
                <p>
                  Type: <span className="text-gray-900">{formData.type}</span>
                </p>
                <p>
                  Value:{' '}
                  <span className="text-gray-900">
                    {formData.type === 'Fixed' ? '$' : ''}
                    {formData.value || '0'}
                    {formData.type === 'Percentage' ? '%' : ''}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
