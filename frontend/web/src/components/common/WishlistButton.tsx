import { useWishlist } from '@/src/context/WishlistContext';
import { Heart } from 'lucide-react';

export const WishlistButton = ({ productId }: { productId: string }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const active = isInWishlist(productId);

  return (
    <button onClick={() => toggleWishlist(productId)}>
      <Heart
        size={22}
        className={`transition ${
          active ? 'fill-red-500 text-red-500' : 'text-gray-400'
        }`}
      />
    </button>
  );
};
