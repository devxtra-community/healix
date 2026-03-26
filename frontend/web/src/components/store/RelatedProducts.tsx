'use client';

import { useEffect, useState } from 'react';
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

type CategoryRef = string | { _id?: string } | null | undefined;

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

function getCategoryId(category: CategoryRef): string | undefined {
  if (!category) return undefined;
  if (typeof category === 'string') return category;
  return category._id;
}

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

const RelatedProducts = ({
  categoryId,
  currentProductId,
}: RelatedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data =
          (await productService.getProducts()) as ProductApiResponse[];

        const filtered = data
          .filter((p) => {
            const catId = getCategoryId(p.category_id);
            const currentCatId = getCategoryId(categoryId);
            return catId === currentCatId && p._id !== currentProductId;
          })
          .slice(0, 4);

        const mapped: Product[] = filtered.map((item) => {
          const version = pickCurrentVersion(item);
          const variantId =
            (typeof item.current_version_id === 'string' &&
              item.current_version_id) ||
            version._id ||
            '';
          return {
            id: item._id,
            categoryId: getCategoryId(item.category_id) ?? '',
            name: version.name ?? 'Product',
            variantId,
            price: version.price ?? 0,
            image: version.images?.[0] ?? null,
            stock: item.stock?.available ?? 0,
          };
        });

        setProducts(mapped);
      } catch (err) {
        setError('Failed to load related products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadProducts();
    }
  }, [categoryId, currentProductId]);

  if (loading) return null;
  if (error || products.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">More Like This</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
