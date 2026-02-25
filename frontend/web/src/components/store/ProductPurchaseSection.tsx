'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cartService } from '@/src/services/cart.service';
import { toast, Toaster } from 'sonner';

interface Props {
  productId: string;
  variantId: string;
  stock: number;
  price: number;
}

export default function ProductPurchaseSection({
  productId,
  variantId,
  stock,
  price,
}: Props) {
  const [qty, setQty] = useState(1);

  const handleAddToCart = async () => {
    if (qty > stock) {
      toast.error('Not enough stock');
      return;
    }

    if (!variantId) {
      toast.error('Product variant not found');
      return;
    }

    try {
      await cartService.addToCart({
        productId,
        variantId,
        quantity: qty,
      });

      toast.success('Added to cart', {
        description: `${qty} item(s) added successfully.`,
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={stock === 0}
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="px-4 text-sm font-medium">{qty}</span>

          <button
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            disabled={stock === 0}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-500">Stock: {stock}</p>
      </div>

      {/* Add to Cart */}
      <button
        disabled={stock === 0}
        onClick={handleAddToCart}
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {stock === 0
          ? 'Out of Stock'
          : `Add to Cart • ₹${(price * qty).toLocaleString()}`}
      </button>

      <Toaster />
    </div>
  );
}
