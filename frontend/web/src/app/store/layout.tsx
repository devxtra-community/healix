'use client';

import { WishlistProvider } from '@/src/context/WishlistContext';
import { CartProvider } from '@/src/context/CartContext';
import Navbar from '@/src/components/store/Navbar';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WishlistProvider>
      <CartProvider>
        <Navbar />
        {children}
      </CartProvider>
    </WishlistProvider>
  );
}
