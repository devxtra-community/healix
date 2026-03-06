import { Cart, CartDiscount, CartItem } from '../domain/cart.types.js';

export interface CartRepository {
  getCart(userId: string): Promise<Cart | null>;

  upsertItem(userId: string, item: CartItem): Promise<void>;

  removeItem(
    userId: string,
    productId: string,
    variantId: string,
  ): Promise<void>;

  updateCartMeta(
    userId: string,
    data: {
      itemCount: number;
      cartTotal: number;
      discount?: CartDiscount;
      expiresAt: number;
    },
  ): Promise<void>;

  clearCart(userId: string): Promise<void>;
}
