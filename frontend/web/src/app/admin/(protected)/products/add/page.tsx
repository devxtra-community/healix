'use client';

import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import ProductForm, {
  ProductData,
} from '@/src/components/admin/products/ProductForm';
import { useState } from 'react';
import { productService } from '@/src/services/product.service';

const initialProductState: ProductData = {
  categoryId: '66c9f8c12c9b1f0012abcd12',

  versionData: {
    name: 'Plant Protein Blend',
    description: 'Clean plant-based protein for daily nutrition',
    brand: 'Healix Nutrition',
    tags: ['plant-protein', 'vegan', 'fitness'],
    price: 1899,
    images: [],
    status: 'active',
    attributes: {
      flavor: 'Vanilla',
      pack_size: '1kg',
      form: 'powder',
    },
  },

  detailsData: {
    nutrition_facts: {
      serving_size: '30g',
      calories: 110,
      macros: {
        protein: 22,
        carbs: 4,
        fat: 2,
        fiber: 3,
      },
      vitamins: {
        'Vitamin B12': '2.4mcg',
      },
      minerals: {
        Iron: '5mg',
        Calcium: '100mg',
      },
    },
    ingredients: [
      {
        name: 'Pea Protein Isolate',
        origin: 'Peas',
        organic: true,
      },
      {
        name: 'Brown Rice Protein',
        origin: 'Rice',
        organic: false,
      },
    ],
    benefits: ['Supports muscle recovery', 'Vegan-friendly', 'Easy digestion'],
    suitable_for: ['Vegans', 'Athletes', 'Weight management'],
  },

  initialStock: 150,
};

export default function AddProductPage() {
  const [formData, setFormData] = useState<ProductData>(initialProductState);

  const { createProduct } = productService;

  const handleSubmit = async () => {
    const res = await createProduct(formData);
    console.log(res);
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Create a new product in your store
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:translate-y-[-1px] shadow-lg shadow-black/5 transition-all"
          >
            <Save size={18} />
            Save Product
          </button>
        </div>
      </div>

      <ProductForm formData={formData} setFormData={setFormData} />
    </div>
  );
}
