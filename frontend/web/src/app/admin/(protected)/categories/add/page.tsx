'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CategoryFormData,
  CategoryType,
  HealthGoal,
} from '@/src/types/api/category.api';
import { CategoryService } from '@/src/services/category.service';
import { toast, Toaster } from 'sonner';

interface CategoryFormProps {
  initialData?: CategoryFormData;
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    image: '',
    category_type: 'nutrition',
    health_goal: [],
    is_active: true,
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const categoryTypes: CategoryType[] = [
    'nutrition',
    'supplement',
    'vitamin',
    'superfood',
    'herb',
  ];

  const healthGoals: HealthGoal[] = [
    'weight-loss',
    'muscle-gain',
    'immunity',
    'gut-health',
    'heart-health',
    'energy',
  ];

  const toggleHealthGoal = (goal: HealthGoal) => {
    setFormData((prev) => ({
      ...prev,
      health_goal: prev.health_goal.includes(goal)
        ? prev.health_goal.filter((g) => g !== goal)
        : [...prev.health_goal, goal],
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEditMode = Boolean(initialData?._id);

      // const url = isEditMode
      //   ? `/api/categories/${initialData?._id}`
      //   : `/api/categories`;

      // const method = isEditMode ? 'PUT' : 'POST';

      const response = await CategoryService.createCategory(formData);

      if (response) {
        toast.success('Category created!', {
          description: `Category created successfully.`,
        });
      }

      router.refresh();

      if (!isEditMode) {
        setFormData({
          name: '',
          description: '',
          image: '',
          category_type: 'nutrition',
          health_goal: [],
          is_active: true,
        });
      }

      router.push('/admin/categories');
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const buttonText = loading
    ? 'Saving...'
    : initialData
      ? 'Update Category'
      : 'Create Category';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white flex justify-center  w-full p-8 "
    >
      <div className="flex flex-col gap-6 max-w-3xl border p-8 rounded-2xl border-gray-100">
        {/* Name */}
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            required
            className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-xl"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows={3}
            className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-xl"
            value={formData.description ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="text-sm font-medium">Image URL</label>
          <input
            className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-xl"
            value={formData.image ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                image: e.target.value,
              })
            }
          />
        </div>

        {/* Category Type */}
        <div>
          <label className="text-sm font-medium">Category Type</label>
          <select
            className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-xl"
            value={formData.category_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                category_type: e.target.value as CategoryType,
              })
            }
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
          <label className="text-sm font-medium mb-2 block">Health Goals</label>
          <div className="flex flex-wrap gap-2">
            {healthGoals.map((goal) => {
              const selected = formData.health_goal.includes(goal);

              return (
                <button
                  type="button"
                  key={goal}
                  onClick={() => toggleHealthGoal(goal)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    selected ? 'bg-black text-white' : 'bg-gray-50'
                  }`}
                >
                  {goal}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Toggle */}
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
          <label className="text-sm">Active</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 rounded-xl mt-4 disabled:opacity-50"
        >
          {buttonText}
        </button>
      </div>
      <Toaster />
    </form>
  );
}
