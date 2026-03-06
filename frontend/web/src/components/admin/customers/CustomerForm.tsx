'use client';

import { useState, useEffect, FormEvent } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  AlignLeft,
  AlertCircle,
} from 'lucide-react';
import { Customer } from '@/src/types/api/customer.api';

export interface CustomerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'Active' | 'Blocked';
  street: string;
  city: string;
  country: string;
  notes: string;
}

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (data: CustomerFormValues) => void;
}

export default function CustomerForm({
  initialData,
  onSubmit,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'Active',
    street: '',
    city: '',
    country: '',
    notes: '',
  });

  useEffect(() => {
    if (!initialData) return;

    const [firstName = '', lastName = ''] = initialData.name?.split(' ') ?? [];

    setFormData((prev) => ({
      ...prev,
      firstName,
      lastName,
      email: initialData.email ?? '',
      phone: initialData.phone ?? '',
      status: initialData.isActive ? 'Active' : 'Blocked',
    }));
  }, [initialData]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      id="customer-form"
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-gray-400" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="First Name"
            />

            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Last Name"
            />

            <div className="relative">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email Address"
              />
            </div>

            <div className="relative">
              <Phone
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="tel"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Phone Number"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin size={20} className="text-gray-400" />
            Address
          </h2>

          <div className="flex flex-col gap-6">
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
              placeholder="Street Address"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="City"
              />

              <select
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>

          <select
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'Active' | 'Blocked',
              })
            }
          >
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>

          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-3">
            <AlertCircle size={14} />
            Blocked customers cannot place orders.
          </p>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlignLeft size={20} className="text-gray-400" />
            Notes
          </h2>

          <textarea
            rows={6}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Add internal notes about this customer..."
          />
        </div>
      </div>
    </form>
  );
}
