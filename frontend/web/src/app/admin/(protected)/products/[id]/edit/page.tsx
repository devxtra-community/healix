'use client';

import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import ProductForm, {
  ProductData,
} from '@/src/components/admin/products/ProductForm';
import { productService } from '@/src/services/product.service';
import { UpdateProductVersionDTO } from '@/src/dtos/product.dtos';
import { mapProductDetailsToCreateDTO } from '@/src/mappers/product-details.mapper';
import { mapProductVersionToUpdateDTO } from '@/src/mappers/product-version.mapper';

// Mock data based on the provided schema for verification

const initialProductState: ProductData = {
  categoryId: 'sss',

  versionData: {
    name: 'Plant Protein Blend',
    description: 'Clean plant-based protein for daily nutrition',
    brand: 'Healix Nutrition',
    tags: ['plant-protein', 'vegan', 'fitness'],
    price: 1899,
    images: [
      'https://cdn.healix.com/products/plant-protein-front.jpg',
      'https://cdn.healix.com/products/plant-protein-back.jpg',
    ],
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

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [formData, setFormData] = useState<ProductData>(initialProductState);

  useEffect(() => {
    (async () => {
      const res = await productService.getProduct('697206f7ce094f654104b696');

      const mappedData: ProductData = {
        categoryId: res.category_id,
        versionData: res.current_version_id,
        detailsData: res.details,
        initialStock: res.stock.available,
      };

      setFormData(mappedData);

      console.log(res);
    })();
  }, []);

  const handleSubmit = async () => {
    const payload: UpdateProductVersionDTO = {
      updateData: mapProductVersionToUpdateDTO(formData.versionData),
      detailsData: mapProductDetailsToCreateDTO(formData.detailsData),
      initialStock: formData.initialStock,
    };

    console.log(payload);
    const res = await productService.createNewVersion(
      '697206f7ce094f654104b696',
      payload,
    );
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Update product details for #{id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:translate-y-[-1px] shadow-lg shadow-black/5 transition-all"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      <ProductForm
        initialData={formData}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
