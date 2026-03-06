'use client';

import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import ProductForm, {
  ProductData,
} from '@/src/components/admin/products/ProductForm';
import { useState } from 'react';
import { productService } from '@/src/services/product.service';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';

const initialProductState: ProductData = {
  categoryId: '', // 🔥 remove hardcoded ID

  versionData: {
    name: '',
    description: '',
    brand: '',
    tags: [],
    price: 0,
    images: [],
    status: 'active',
    attributes: {
      flavor: '',
      pack_size: '',
      form: 'powder',
    },
  },

  detailsData: {
    nutrition_facts: {
      serving_size: '',
      calories: 0,
      macros: {
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
      vitamins: {},
      minerals: {},
    },
    ingredients: [],
    benefits: [],
    suitable_for: [],
  },

  initialStock: 0,
};

export default function AddProductPage() {
  const [formData, setFormData] = useState<ProductData>(initialProductState);

  const { createProduct } = productService;
  const router = useRouter();

  const handleSubmit = async () => {
    if (!formData.categoryId) {
      toast.warning('Please select a category');
      return;
    }
    await createProduct(formData);
    router.push('/admin/products');
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <p className="text-sm text-gray-500">Create a new product</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl"
        >
          <Save size={18} />
          Save Product
        </button>
      </div>

      <ProductForm formData={formData} setFormData={setFormData} />
      <Toaster />
    </div>
  );
}
