'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { wishlistService } from '../services/wishlist.service';

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

type IItem = {
  product: {
    _id: string;
  };
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const data = await wishlistService.getWishlist();
      const ids = data?.products?.map((item: IItem) => item.product._id) || [];
      setWishlistIds(ids);
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (productId: string) => {
    const exists = wishlistIds.includes(productId);

    // Optimistic update
    if (exists) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      await wishlistService.removeFromWishlist(productId);
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      await wishlistService.addToWishlist(productId);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used inside WishlistProvider');
  }
  return context;
};
