'use client';

import { useEffect, useState } from 'react';
import api from '@/src/lib/axios.user';
import ProductCard from './ProductCard';
import { ApiProduct, Product } from '@/src/types/product';

const ProductSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get<ApiProduct[]>('/product');

        const mapped = data.map((item) => ({
          id: item._id,
          name: item.current_version.name,
          price: item.current_version.price,
          image: item.current_version.images?.[0] || '/placeholder.png',
          stock: item.stock?.available ?? 0,
        }));

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
