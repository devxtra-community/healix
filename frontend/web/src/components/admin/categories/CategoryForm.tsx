'use client';

import { useState, useEffect } from 'react';

interface CategoryFormProps {
  initialData?: {
    name: string;
    description: string;
    status: string;
    icon: string;
  };
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
    icon: '⚡',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const icons = ['⚡', '👕', '🏡', '📚', '⚽', '💄', '🧸', '🎮', '💍', '🚗'];

  return (
    <form className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 sm:p-8 max-w-3xl">
      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category Name
          </label>
          <input
            type="text"
            placeholder="e.g. Electronics"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Describe this category..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-y"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status
            </label>
            <select
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`
                                        w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all
                                        ${
                                          formData.icon === icon
                                            ? 'bg-black text-white shadow-md'
                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                        }
                                    `}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
