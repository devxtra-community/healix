'use client';

import { useEffect, useState } from 'react';
import { wishlistService } from '@/src/services/wishlist.service';
import { resolveImage } from '@/src/lib/resolve.image';

interface ProductVersion {
  name: string;
  price: number;
  images: string[];
}

interface Product {
  _id: string;
  current_version_id: ProductVersion;
}

interface WishlistItem {
  product: Product;
  isDeleted: boolean;
  deletedAt: string | null;
}

interface WishlistResponse {
  user: string;
  products: WishlistItem[];
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistService.getWishlist();
      setWishlist(res);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeProduct = async (productId: string) => {
    await wishlistService.removeFromWishlist(productId);
    fetchWishlist();
  };

  const clearWishlist = async () => {
    await wishlistService.clearWishlist();
    fetchWishlist();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading wishlist...</p>
      </div>
    );
  }

  const products = wishlist?.products || [];

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          My Wishlist ({products.length})
        </h1>

        {products.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Your wishlist is empty 💔</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => {
            const version = item.product.current_version_id;

            return (
              <div
                key={item.product._id}
                className="bg-white p-5 rounded-xl shadow-sm border"
              >
                <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  {version?.images?.[0] && (
                    <img
                      src={resolveImage(version.images[0])}
                      alt={version.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <p className="font-medium text-lg">{version?.name}</p>

                <p className="text-gray-600 mt-1">₹{version?.price}</p>

                <div className="mt-4 flex gap-3">
                  <button className="flex-1 bg-black text-white py-2 rounded-lg hover:opacity-90 transition">
                    Move to Cart
                  </button>

                  <button
                    onClick={() => removeProduct(item.product._id)}
                    className="px-4 border rounded-lg hover:bg-gray-100 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
