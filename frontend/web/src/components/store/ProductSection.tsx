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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data =
          (await productService.getProducts()) as ProductApiResponse[];

        const mapped: Product[] = data.map((item) => {
          const version = pickCurrentVersion(item);
          console.log('API ITEM', item);
          const variantId =
            (typeof item.current_version_id === 'string' &&
              item.current_version_id) ||
            version._id ||
            '';
          return {
            id: item._id,
            name: version.name ?? 'Product',
            variantId,
            price: version.price ?? 0,
            image: version.images?.[0] ?? null,
            stock: item.stock?.available ?? 0,
          };
        });
        console.log('MAPPED', mapped);

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

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="px-4 max-w-7xl mx-auto pb-20">
      <h2 className="text-2xl font-bold mb-8">Popular Products</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
