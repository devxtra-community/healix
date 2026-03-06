'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { cartService } from '@/src/services/cart.service';
import axios from 'axios';

interface CartItem {
  quantity: number;
}

interface CartContextType {
  cartCount: number;
  refreshCart: () => Promise<void>;
  incrementCart: (qty: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    const data = await cartService.getCart();

    const totalItems =
      data?.items?.reduce(
        (acc: number, item: CartItem) => acc + item.quantity,
        0,
      ) || 0;

    setCartCount(totalItems);
  };

  const incrementCart = (qty: number) => {
    setCartCount((prev) => prev + qty);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await refreshCart();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          return; // guest user
        }

        console.error(err);
      }
    };

    init();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart, incrementCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
};
