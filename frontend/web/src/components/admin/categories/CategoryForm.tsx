'use client';

import {
  CategoryFormValues,
  CategoryType,
  HealthGoal,
} from '@/src/types/api/category.api';
import { useEffect, useState } from 'react';

interface CategoryFormProps {
  initialData?: (CategoryFormValues & { _id?: string }) | null;
  onSubmit: (data: CategoryFormValues) => void;
  loading?: boolean;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  loading = false,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormValues>({
    name: '',
    description: '',
    category_type: 'nutrition',
    health_goal: [] as HealthGoal[],
    is_active: true,
  });

  // ✅ Only update when ID changes (prevents infinite loop)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category_type: initialData.category_type || 'nutrition',
        health_goal: initialData.health_goal || [],
        is_active: initialData.is_active ?? true,
      });
    }
  }, [initialData?._id]);

  const categoryTypes = [
    'nutrition',
    'supplement',
    'vitamin',
    'superfood',
    'herb',
  ];

  const healthGoals = [
    'weight-loss',
    'muscle-gain',
    'immunity',
    'energy',
    'digestion',
    'skin-health',
  ];

  const toggleHealthGoal = (goal: HealthGoal) => {
    setFormData((prev) => ({
      ...prev,
      health_goal: prev.health_goal.includes(goal)
        ? prev.health_goal.filter((g) => g !== goal)
        : [...prev.health_goal, goal],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex flex-col gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Category Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
          />
        </div>

        {/* Category Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Category Type
          </label>
          <select
            value={formData.category_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                category_type: e.target.value as CategoryType,
              })
            }
            className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
          >
            {categoryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Health Goals */}
        <div>
          <label className="block text-sm font-medium mb-2">Health Goals</label>
          <div className="flex flex-wrap gap-2">
            {healthGoals.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleHealthGoal(goal as HealthGoal)}
                className={`px-3 py-1 rounded-full text-xs transition ${
                  formData.health_goal.includes(goal as HealthGoal)
                    ? 'bg-black text-white'
                    : 'bg-gray-100'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({
                ...formData,
                is_active: e.target.checked,
              })
            }
          />
          <span className="text-sm">Active Category</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 rounded-xl disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
