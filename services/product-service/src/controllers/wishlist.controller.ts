import { Request, Response } from 'express';
import { WishlistService } from '../services/wishlist.service.js';

const wishlistService = new WishlistService();

const getUserIdFromHeader = (req: Request): string | null => {
  const userId = req.headers['x-user-id'];

  if (!userId || Array.isArray(userId)) {
    return null;
  }

  return userId;
};

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromHeader(req);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const wishlist = await wishlistService.getWishlist(userId);
    return res.status(200).json(wishlist);
  } catch {
    return res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromHeader(req);
    const { productId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const wishlist = await wishlistService.addToWishlist(userId, productId);

    return res.status(200).json(wishlist);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message || 'Failed to add to wishlist',
      });
    }
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromHeader(req);
    const { productId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const wishlist = await wishlistService.removeFromWishlist(
      userId,
      productId,
    );

    return res.status(200).json(wishlist);
  } catch {
    return res.status(500).json({
      message: 'Failed to remove from wishlist',
    });
  }
};

export const clearWishlist = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromHeader(req);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const wishlist = await wishlistService.clearWishlist(userId);

    return res.status(200).json({
      message: 'Wishlist cleared successfully',
      wishlist,
    });
  } catch {
    return res.status(500).json({
      message: 'Failed to clear wishlist',
    });
  }
};
