'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  addressService,
  AddressPayload,
  SavedAddress,
} from '@/src/services/address.service';

type FormState = AddressPayload;

const EMPTY_FORM: FormState = {
  addressType: 'home',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: '',
  zip: '',
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await addressService.getAddresses();
        setAddresses(data);
      } catch (error) {
        console.error('Failed to load addresses', error);
        toast.error('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleEdit = (address: SavedAddress) => {
    setEditingId(address._id);
    setForm({
      addressType: address.addressType,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      country: address.country,
      zip: address.zip,
    });
  };

  const handleDelete = async (addressId: string) => {
    setDeletingId(addressId);
    try {
      await addressService.deleteAddress(addressId);
      setAddresses((prev) =>
        prev.filter((address) => address._id !== addressId),
      );
      if (editingId === addressId) {
        resetForm();
      }
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Failed to delete address', error);
      toast.error('Failed to delete address');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await addressService.updateAddress(editingId, form);
        setAddresses((prev) =>
          prev.map((address) =>
            address._id === editingId ? { ...address, ...form } : address,
          ),
        );
        toast.success('Address updated successfully');
      } else {
        const created = await addressService.createAddress(form);
        setAddresses((prev) => [created, ...prev]);
        toast.success('Address added successfully');
      }

      resetForm();
    } catch (error) {
      console.error('Address save failed', error);
      toast.error('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading addresses...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 md:py-10">
      <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold">My Addresses</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add, edit, and remove your delivery addresses.
        </p>
      </section>

      <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-lg mb-4">
          {isEditing ? 'Edit Address' : 'Add New Address'}
        </h2>

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <select
            value={form.addressType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                addressType: e.target.value as AddressPayload['addressType'],
              }))
            }
            className="border border-gray-200 rounded-xl p-3"
            required
          >
            <option value="home">Home</option>
            <option value="office">Office</option>
            <option value="billing">Billing</option>
          </select>

          <input
            value={form.addressLine1}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, addressLine1: e.target.value }))
            }
            placeholder="Address line 1"
            className="border border-gray-200 rounded-xl p-3"
            required
          />

          <input
            value={form.addressLine2}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, addressLine2: e.target.value }))
            }
            placeholder="Address line 2 (optional)"
            className="border border-gray-200 rounded-xl p-3"
          />

          <input
            value={form.city}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, city: e.target.value }))
            }
            placeholder="City"
            className="border border-gray-200 rounded-xl p-3"
            required
          />

          <input
            value={form.state}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, state: e.target.value }))
            }
            placeholder="State"
            className="border border-gray-200 rounded-xl p-3"
            required
          />

          <input
            value={form.country}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, country: e.target.value }))
            }
            placeholder="Country"
            className="border border-gray-200 rounded-xl p-3"
            required
          />

          <input
            value={form.zip}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, zip: e.target.value }))
            }
            placeholder="ZIP / Postal Code"
            className="border border-gray-200 rounded-xl p-3"
            required
          />

          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-5 py-3 rounded-xl font-medium disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : isEditing
                  ? 'Update Address'
                  : 'Add Address'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-100 text-gray-800 px-5 py-3 rounded-xl font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {addresses.length === 0 ? (
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-600">
            No addresses added yet.
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
            >
              <p className="font-semibold capitalize">{address.addressType}</p>
              <p className="text-gray-700 mt-1">
                {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                {`, ${address.city}, ${address.state}, ${address.country} - ${address.zip}`}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(address)}
                  className="px-3 py-2 bg-gray-200 rounded-lg text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  disabled={deletingId === address._id}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm disabled:opacity-50"
                >
                  {deletingId === address._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
