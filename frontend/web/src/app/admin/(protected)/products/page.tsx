'use client';

import Link from 'next/link';
import { Download, Plus } from 'lucide-react';
import ProductsTable from '@/src/components/admin/products/ProductsTable';
import { useEffect, useState } from 'react';
import { productService } from '@/src/services/product.service';
import { PaginatedResponse } from '@/src/types/api/pagination';
import { ProductApiResponse } from '@/src/types/api/product.api';
import { toast, Toaster } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] =
    useState<PaginatedResponse<ProductApiResponse> | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await productService.getAllProductsAdmin({
        page: currentPage,
        limit,
      });

      setProducts(res);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await productService.deleteProduct(productId);
      toast.success('Product deleted');
      fetchProducts(page); // refetch current page
    } catch (err) {
      console.error(err);
      toast.error('Product not deleted');
    }
  };

  const handleRestore = async (productId: string) => {
    try {
      await productService.restoreProduct(productId);
      toast.success('Product restored');
      fetchProducts(page);
    } catch (err) {
      console.error(err);
      toast.error('Product not restored');
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
        <>
          <ProductsTable
            products={products.data}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-500">
              Showing page {products.page} of {products.totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={page === products.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {loading && (
        <div className="text-center text-gray-400 text-sm">
          Loading products...
        </div>
      )}

      <Toaster />
    </div>
  );
}
