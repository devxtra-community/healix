'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Product } from '@/src/types/product';
import { cartService } from '@/src/services/cart.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { WishlistButton } from '../common/WishlistButton';
import { resolveImage } from '@/src/lib/resolve.image';
import { useCart } from '@/src/context/CartContext';

const ProductCard = ({ product }: { product: Product }) => {
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const { incrementCart } = useCart();

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = async () => {
    if (qty > product.stock) {
      toast.error('Not enough stock');
      return;
    }

    if (!product.variantId) {
      toast.error('Product variant not found');
      return;
    }

    try {
      await cartService.addToCart({
        productId: product.id,
        variantId: product.variantId,
        quantity: qty,
      });

      incrementCart(qty);
      toast.success('Added to cart');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div
      className={`border rounded-3xl p-6 hover:shadow-xl transition relative ${
        isOutOfStock ? 'opacity-70' : ''
      }`}
    >
      {/* Image + out-of-stock overlay */}
      <div
        className="h-40 flex justify-center mb-4 relative cursor-pointer"
        onClick={() => router.push(`/store/${product.id}`)}
      >
        <img
          src={resolveImage(product.image)}
          alt={product.name}
          className={`h-full object-contain ${isOutOfStock ? 'grayscale' : ''}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-lg font-bold">₹{product.price}</p>

          {/* Stock badge */}
          {isOutOfStock ? (
            <span className="inline-block text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full mt-1">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="inline-block text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-1">
              Only {product.stock} left
            </span>
          ) : (
            <span className="inline-block text-xs text-gray-400 mt-1">
              In Stock
            </span>
          )}
        </div>

        <WishlistButton productId={product.id} />
      </div>

      <div className="flex justify-between items-center mt-3">
        <div
          className={`flex items-center bg-gray-100 rounded-full px-2 ${
            isOutOfStock ? 'opacity-40 pointer-events-none' : ''
          }`}
        >
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-3">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
