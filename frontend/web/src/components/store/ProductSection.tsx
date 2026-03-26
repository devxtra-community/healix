'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/src/services/product.service';
import ProductCard from './ProductCard';
import { Product } from '@/src/types/product';
import { ProductApiResponse } from '@/src/types/api/product.api';

type ProductVersionLike = {
  _id?: string;
  name?: string;
  price?: number;
  images?: string[];
};

function pickCurrentVersion(item: ProductApiResponse): ProductVersionLike {
  if (item.current_version && typeof item.current_version === 'object') {
    return item.current_version;
  }

  if (
    item.current_version_id &&
    typeof item.current_version_id === 'object' &&
    !Array.isArray(item.current_version_id)
  ) {
    return item.current_version_id;
  }

  return {};
}

const ProductSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams.get('category');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data =
          (await productService.getProducts()) as ProductApiResponse[];

        const mapped: Product[] = data.map((item) => {
          const version = pickCurrentVersion(item);
          const variantId =
            (typeof item.current_version_id === 'string' &&
              item.current_version_id) ||
            version._id ||
            '';
          return {
            id: item._id,
            categoryId: item.category_id,
            name: version.name ?? 'Product',
            variantId,
            price: version.price ?? 0,
            image: version.images?.[0] ?? null,
            stock: item.stock?.available ?? 0,
          };
        });

        setProducts(mapped);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = selectedCategoryId
    ? products.filter((product) => product.categoryId === selectedCategoryId)
    : products;

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section
      id="products-section"
      className="px-4 max-w-7xl mx-auto pb-20 scroll-mt-28"
    >
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Popular Products</h2>
          <p className="text-sm text-gray-500 mt-2">
            {selectedCategoryId
              ? `${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} in this category`
              : `${products.length} product${products.length === 1 ? '' : 's'} available`}
          </p>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            No products found
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            This category does not have any visible products right now.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductSection;
