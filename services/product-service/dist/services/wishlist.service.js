import { WishlistRepository } from '../repositories/wishlist.repositories.js';
export class WishlistService {
    wishlistRepo = new WishlistRepository();
    async getWishlist(userId) {
        return await this.wishlistRepo.getActiveProducts(userId);
    }
    async addToWishlist(userId, productId) {
        if (!productId) {
            throw new Error('Product ID is required');
        }
        return this.wishlistRepo.addOrRestoreProduct(userId, productId);
    }
    async removeFromWishlist(userId, productId) {
        return this.wishlistRepo.softDeleteProduct(userId, productId);
    }
    async clearWishlist(userId) {
        return this.wishlistRepo.softDeleteAllProducts(userId);
    }
}
