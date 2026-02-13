'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Product } from '@/src/types/product';

const ProductCard = ({ product }: { product: Product }) => {
  const [qty, setQty] = useState(1);

  return (
    <div className="border rounded-3xl p-6 hover:shadow-xl transition">
      <div className="h-40 flex justify-center mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="h-full object-contain"
        />
      </div>

      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-lg font-bold">₹{product.price}</p>
      <p className="text-xs text-gray-500 mb-4">Stock: {product.stock}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center bg-gray-100 rounded-full px-2">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-3">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)}>
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-semibold">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
