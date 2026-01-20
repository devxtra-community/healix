'use client';

import { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

export default function ProductForm() {
  const [images, setImages] = useState<string[]>([]);

  // Mock image upload
  const handleImageUpload = () => {
    // Just adding a placeholder for visual demo
    setImages([...images, 'placeholder']);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                rows={6}
                placeholder="Describe your product..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Media</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded-xl relative group"
              >
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  🖼️
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleImageUpload}
              className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-500"
            >
              <Upload size={24} />
              <span className="text-xs font-medium">Add Image</span>
            </button>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Inventory
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                SKU
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Barcode (ISBN, UPC)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar Settings */}
      <div className="flex flex-col gap-8">
        {/* Status */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
          <div className="flex flex-col gap-3">
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <AlertCircle size={14} />
              Product will be available to 5 sales channels.
            </p>
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
                Category
              </label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer">
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Garden</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vendor
              </label>
              <input
                type="text"
                placeholder="e.g. Nike"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Compare at price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
