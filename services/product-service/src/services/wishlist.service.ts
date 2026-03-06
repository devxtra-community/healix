import { WishlistRepository } from '../repositories/wishlist.repositories.js';

export class WishlistService {
  private wishlistRepo = new WishlistRepository();

  async getWishlist(userId: string) {
    return await this.wishlistRepo.getActiveProducts(userId);
  }

  async addToWishlist(userId: string, productId: string) {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    return this.wishlistRepo.addOrRestoreProduct(userId, productId);
  }

  async removeFromWishlist(userId: string, productId: string) {
    return this.wishlistRepo.softDeleteProduct(userId, productId);
  }

  async clearWishlist(userId: string) {
    return this.wishlistRepo.softDeleteAllProducts(userId);
  }
}
