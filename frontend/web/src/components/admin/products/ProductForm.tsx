'use client';

import { useState } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';

interface Ingredient {
  name: string;
  origin: string;
  organic: boolean;
}

interface NutritionFacts {
  serving_size: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  vitamins: Record<string, string>;
  minerals: Record<string, string>;
}

export interface ProductDetails {
  nutrition_facts: NutritionFacts;
  ingredients: Ingredient[];
  benefits: string[];
  suitable_for: string[];
}

export interface ProductVersion {
  name: string;
  description: string;
  brand: string;
  tags: string[];
  price: number;
  images: string[];
  status:
    | 'active'
    | 'inactive'
    | 'out-of-stock'
    | 'coming-soon'
    | 'discontinued';
  attributes: {
    flavor: string;
    pack_size: string;
    form: 'powder' | 'capsule' | 'liquid' | 'bar';
  };
}

export interface ProductData {
  categoryId: string;
  versionData: ProductVersion;
  detailsData: ProductDetails;
  initialStock: number;
}

interface ProductFormProps {
  initialData?: ProductData | null;
  formData: ProductData;
  setFormData: React.Dispatch<React.SetStateAction<ProductData>>;
}

export default function ProductForm({
  formData,
  setFormData,
}: ProductFormProps) {
  const [tagInput, setTagInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [suitableInput, setSuitableInput] = useState('');

  const updateVersion = <K extends keyof ProductVersion>(
    field: K,
    value: ProductVersion[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      versionData: { ...prev.versionData, [field]: value },
    }));
  };

  const updateAttribute = <K extends keyof ProductVersion['attributes']>(
    field: K,
    value: ProductVersion['attributes'][K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      versionData: {
        ...prev.versionData,
        attributes: { ...prev.versionData.attributes, [field]: value },
      },
    }));
  };

  type SignedUrlResponse = {
    uploadUrl: string;
    key: string;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    try {
      // 1️⃣ Get signed URLs from backend
      const response = await fetch(
        'http://localhost:4000/api/v1/products/generate-upload-url',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileType: file.type,
          }),
        },
      );

      const data: SignedUrlResponse = await response.json();

      // 2️⃣ Upload file directly to S3
      await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      // 3️⃣ Save signed GET URL into state
      setFormData((prev) => ({
        ...prev,
        versionData: {
          ...prev.versionData,
          images: [...prev.versionData.images, data.key],
        },
      }));

      console.log('Upload success ✅');
    } catch (error) {
      console.error('Upload failed ❌', error);
    }
  };

  const removeImage = (index: number) => {
    updateVersion(
      'images',
      formData.versionData.images.filter((_, i) => i !== index),
    );
  };

  const addTag = () => {
    if (tagInput.trim()) {
      updateVersion('tags', [...formData.versionData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    updateVersion(
      'tags',
      formData.versionData.tags.filter((_, i) => i !== index),
    );
  };

  const updateNutrition = <K extends keyof NutritionFacts>(
    field: K,
    value: NutritionFacts[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      detailsData: {
        ...prev.detailsData,
        nutrition_facts: {
          ...prev.detailsData.nutrition_facts,
          [field]: value,
        },
      },
    }));
  };

  const updateMacro = <K extends keyof NutritionFacts['macros']>(
    field: K,
    value: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      detailsData: {
        ...prev.detailsData,
        nutrition_facts: {
          ...prev.detailsData.nutrition_facts,
          macros: {
            ...prev.detailsData.nutrition_facts.macros,
            [field]: value,
          },
        },
      },
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      detailsData: {
        ...prev.detailsData,
        ingredients: [
          ...prev.detailsData.ingredients,
          { name: '', origin: '', organic: false },
        ],
      },
    }));
  };

  const updateIngredient = <K extends keyof Ingredient>(
    index: number,
    field: K,
    value: Ingredient[K],
  ) => {
    const ingredients = [...formData.detailsData.ingredients];
    ingredients[index] = { ...ingredients[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      detailsData: { ...prev.detailsData, ingredients },
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detailsData: {
        ...prev.detailsData,
        ingredients: prev.detailsData.ingredients.filter((_, i) => i !== index),
      },
    }));
  };

  const addArrayItem = (
    field: 'benefits' | 'suitable_for',
    value: string,
    setter: (v: string) => void,
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        detailsData: {
          ...prev.detailsData,
          [field]: [...prev.detailsData[field], value.trim()],
        },
      }));
      setter('');
    }
  };

  const removeArrayItem = (
    field: 'benefits' | 'suitable_for',
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      detailsData: {
        ...prev.detailsData,
        [field]: prev.detailsData[field].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                value={formData.versionData.name}
                onChange={(e) => updateVersion('name', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.versionData.description}
                onChange={(e) => updateVersion('description', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.versionData.brand}
                  onChange={(e) => updateVersion('brand', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.versionData.status}
                  onChange={(e) =>
                    updateAttribute(
                      'form',
                      e.target.value as ProductVersion['attributes']['form'],
                    )
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tags
              </label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {formData.versionData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(idx)}
                      className="hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  onKeyDown={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addTag())
                  }
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Attributes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Flavor
              </label>
              <input
                type="text"
                value={formData.versionData.attributes.flavor}
                onChange={(e) => updateAttribute('flavor', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pack Size
              </label>
              <input
                type="text"
                value={formData.versionData.attributes.pack_size}
                onChange={(e) => updateAttribute('pack_size', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Form
              </label>
              <input
                type="text"
                placeholder="e.g. Powder"
                value={formData.versionData.attributes.form}
                onChange={(e) =>
                  updateAttribute(
                    'form',
                    e.target.value as ProductVersion['attributes']['form'],
                  )
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
          </div>
        </div>

        {/* Nutrition Facts */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Nutrition Facts
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Serving Size
              </label>
              <input
                type="text"
                value={formData.detailsData.nutrition_facts.serving_size}
                onChange={(e) =>
                  updateNutrition('serving_size', e.target.value)
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Calories
              </label>
              <input
                type="number"
                value={formData.detailsData.nutrition_facts.calories}
                onChange={(e) =>
                  updateNutrition('calories', parseInt(e.target.value) || 0)
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(['protein', 'carbs', 'fat', 'fiber'] as const).map((macro) => (
              <div key={macro}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 capitalize">
                  {macro} (g)
                </label>
                <input
                  type="number"
                  value={
                    formData.detailsData.nutrition_facts.macros[
                      macro as keyof typeof formData.detailsData.nutrition_facts.macros
                    ]
                  }
                  onChange={(e) =>
                    updateMacro(macro, parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
            <button
              type="button"
              onClick={addIngredient}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus size={16} /> Add Ingredient
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {formData.detailsData.ingredients.map((ing, idx) => (
              <div
                key={idx}
                className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={ing.name}
                    onChange={(e) =>
                      updateIngredient(idx, 'name', e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Origin"
                    value={ing.origin}
                    onChange={(e) =>
                      updateIngredient(idx, 'origin', e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ing.organic}
                      onChange={(e) =>
                        updateIngredient(idx, 'organic', e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Organic</span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(idx)}
                  className="text-gray-400 hover:text-red-500 mt-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {formData.detailsData.ingredients.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                No ingredients added yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar Settings */}
      <div className="flex flex-col gap-8">
        {/* Media */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Media</h2>
          <div className="grid grid-cols-2 gap-4">
            {formData.versionData.images.map((img, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded-xl relative group overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Product ${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-500 cursor-pointer">
              <Upload size={24} />
              <span className="text-xs font-medium">Add Image</span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Organization
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category ID
              </label>
              <input
                type="text"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Initial Stock
              </label>
              <input
                type="number"
                value={formData.initialStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    initialStock: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price (Cents)
              </label>
              <input
                type="number"
                value={formData.versionData.price}
                onChange={(e) =>
                  updateVersion('price', parseInt(e.target.value) || 0)
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              placeholder="Add benefit"
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                (e.preventDefault(),
                addArrayItem('benefits', benefitInput, setBenefitInput))
              }
            />
            <button
              type="button"
              onClick={() =>
                addArrayItem('benefits', benefitInput, setBenefitInput)
              }
              className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              <Plus size={18} />
            </button>
          </div>
          <ul className="space-y-2">
            {formData.detailsData.benefits.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeArrayItem('benefits', idx)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Suitable For */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Suitable For
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={suitableInput}
              onChange={(e) => setSuitableInput(e.target.value)}
              placeholder="Add group"
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                (e.preventDefault(),
                addArrayItem('suitable_for', suitableInput, setSuitableInput))
              }
            />
            <button
              type="button"
              onClick={() =>
                addArrayItem('suitable_for', suitableInput, setSuitableInput)
              }
              className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              <Plus size={18} />
            </button>
          </div>
          <ul className="space-y-2">
            {formData.detailsData.suitable_for.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeArrayItem('suitable_for', idx)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button type="submit" className="hidden">
        Submit form trigger
      </button>
    </form>
  );
}
