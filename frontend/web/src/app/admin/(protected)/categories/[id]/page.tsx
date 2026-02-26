'use client';

import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CategoryForm from '@/src/components/admin/categories/CategoryForm';
import { toast } from 'sonner';
import { CategoryService } from '@/src/services/category.service';
import { CategoryFormData } from '@/src/types/api/category.api';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [category, setCategory] = useState<CategoryFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCategory = async () => {
    try {
      const data = await CategoryService.getCategoryById(id);
      setCategory(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCategory();
  }, [id]);

  // ✅ Now receives formData from child
  const handleSave = async (formData: CategoryFormData) => {
    try {
      setSaving(true);
      await CategoryService.updateCategory(id, formData);
      toast.success('Category updated successfully');
      router.push('/admin/categories');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await CategoryService.deleteCategory(id);
      toast.success('Category disabled successfully');
      router.push('/admin/categories');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading category...</div>
    );
  }

  if (!category) {
    return (
      <div className="p-10 text-center text-red-500">Category not found</div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-2 pb-8 max-w-3xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-gray-500 text-sm mt-0.5">ID: {id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Disable Category"
          >
            <Trash2 size={20} />
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <Link
            href="/admin/categories"
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* ✅ Proper pattern */}
      <CategoryForm
        initialData={category}
        onSubmit={handleSave}
        loading={saving}
      />
    </div>
  );
}
