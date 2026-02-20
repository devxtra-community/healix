'use client';

import Link from 'next/link';
import { Download, Plus } from 'lucide-react';
import ProductsTable from '@/src/components/admin/products/ProductsTable';
import { useEffect, useState } from 'react';
import { productService } from '@/src/services/product.service';
import { PaginatedResponse } from '@/src/types/api/pagination';
import { ProductApiResponse } from '@/src/types/api/product.api';

export default function ProductsPage() {
  const [products, setProducts] =
    useState<PaginatedResponse<ProductApiResponse> | null>(null);

  useEffect(() => {
    (async () => {
      const res = await productService.getAllProductsAdmin();
      setProducts(res);
    })();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await productService.deleteProduct(productId);

      // remove from UI instantly
      setProducts((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.filter((p) => p._id !== productId),
            }
          : prev,
      );
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div className="flex flex-col gap-8 pt-2">
      {/* Header */}
      <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your product catalog and inventory
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors max-sm:flex-1">
            <Download size={18} />
            Export
          </button>

          <Link
            href="/admin/products/add"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:translate-y-[-1px] shadow-lg shadow-black/5 transition-all max-sm:flex-1"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Table */}
      {products && (
        <ProductsTable products={products.data} onDelete={handleDelete} />
      )}
    </div>
  );
}
