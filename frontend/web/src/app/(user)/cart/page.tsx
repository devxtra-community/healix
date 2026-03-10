'use client';

import React, { useEffect, useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  User,
  Heart,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { cartService } from '@/src/services/cart.service';
import { useCart } from '@/src/context/CartContext';
import { useRouter } from 'next/navigation';

export type CartItem = {
  productId: string;
  variantId: string;
  price: number;
  quantity: number;
  subtotal: number;
  name: string;
  image: string;
};

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const { refreshCart } = useCart();

  const loadCart = async () => {
    try {
      const cart = await cartService.getCart();
      setCartItems(cart.items || []);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const syncQuantity = async (item: CartItem, quantity: number) => {
    const itemKey = `${item.productId}:${item.variantId}`;
    setUpdatingKey(itemKey);

    try {
      await cartService.updateCartItemQuantity({
        productId: item.productId,
        variantId: item.variantId,
        quantity,
      });
      await Promise.all([loadCart(), refreshCart()]);
    } catch (err) {
      console.error('Failed to update cart quantity', err);
    } finally {
      setUpdatingKey(null);
    }
  };

  const S3_BASE = 'https://healix-product-images.s3.ap-south-1.amazonaws.com/';

  function resolveImage(src?: string | null) {
    if (!src) return '/placeholder.png';
    if (src.startsWith('http')) return src;
    return `${S3_BASE}${src}`;
  }

  const increaseQty = async (item: CartItem) => {
    await syncQuantity(item, item.quantity + 1);
  };

  const decreaseQty = async (item: CartItem) => {
    if (item.quantity <= 1) return;
    await syncQuantity(item, item.quantity - 1);
  };

  const removeItem = async (item: CartItem) => {
    const itemKey = `${item.productId}:${item.variantId}`;
    setUpdatingKey(itemKey);

    try {
      await cartService.removeCartItem(item.productId, item.variantId);
      await Promise.all([loadCart(), refreshCart()]);
    } catch (err) {
      console.error('Failed to remove cart item', err);
    } finally {
      setUpdatingKey(null);
    }
  };

  if (loading) {
    return <div className="p-10">Loading cart...</div>;
  }

  const productCount = cartItems.length;
  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Promo Bar */}
      <div className="bg-[#1a1a1a] text-white text-center py-3 text-sm font-medium">
        Get Free SHIPPING On Order Above $200
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#2EB150] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl">Healix</span>
        </div>

        <div className="hidden md:flex items-center gap-10 font-medium text-sm">
          <a href="#" className="hover:text-[#2EB150]">
            Category
          </a>
          <a href="#" className="hover:text-[#2EB150]">
            Products
          </a>
          <a href="#" className="hover:text-[#2EB150]">
            About
          </a>
        </div>

        <div className="flex items-center gap-6">
          <User size={22} className="cursor-pointer" />
          <Heart size={22} className="cursor-pointer" />
          <ShoppingBag size={22} className="cursor-pointer" />
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-10 py-12">
        <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-8">
            {cartItems.length === 0 && (
              <div className="text-gray-500">Your cart is empty</div>
            )}

            {cartItems.map((item) => {
              const itemKey = `${item.productId}:${item.variantId}`;
              const isUpdating = updatingKey === itemKey;

              return (
                <div
                  key={item.variantId}
                  className="pb-8 border-b border-gray-100 last:border-0 flex items-center gap-6"
                >
                  <div className="bg-[#f3f3f3] rounded-xl p-4 w-32 h-36 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={resolveImage(item.image)}
                        alt={item.name}
                        className="h-full object-contain mix-blend-multiply"
                      />
                    ) : (
                      <ShoppingBag size={40} />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">Product {item.name}</h3>

                    <div className="flex items-center gap-4 border border-gray-200 rounded-full w-fit px-3 py-1 mt-3">
                      <button
                        onClick={() => void decreaseQty(item)}
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>

                      <span className="font-bold text-sm">{item.quantity}</span>

                      <button
                        onClick={() => void increaseQty(item)}
                        disabled={isUpdating}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex flex-col justify-between items-end h-36 py-2">
                    <button
                      onClick={() => void removeItem(item)}
                      disabled={isUpdating}
                      className="text-gray-400 hover:text-red-500 bg-gray-50 p-2 rounded-full"
                    >
                      <Trash2 size={20} />
                    </button>

                    <p className="font-bold text-xl">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-100 rounded-3xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

              <div className="flex justify-between py-4 text-lg">
                <span>Products</span>
                <span>{productCount}</span>
              </div>

              <div className="flex justify-between py-4 text-xl font-bold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                disabled={cartItems.length === 0}
                className="w-full bg-[#00e676] hover:bg-[#00c853] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
