import { Cart, CartDiscount, CartItem } from '../domain/cart.types.js';
import { CartRepository } from './cart.repository.js';

type CartState = {
  userId: string;
  items: CartItem[];
  itemCount: number;
  cartTotal: number;
  discount?: CartDiscount;
  expiresAt: number;
  createdAt: string;
  updatedAt: string;
};

export class InMemoryCartRepository implements CartRepository {
  private carts = new Map<string, CartState>();

  async getCart(userId: string): Promise<Cart | null> {
    const state = this.carts.get(userId);
    if (!state) return null;

    return {
      userId: state.userId,
      items: state.items,
      itemCount: state.itemCount,
      cartTotal: state.cartTotal,
      discount: state.discount,
      expiresAt: new Date(state.expiresAt * 1000).toISOString(),
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
    };
  }

  async upsertItem(userId: string, item: CartItem): Promise<void> {
    const now = new Date().toISOString();
    const state = this.ensureState(userId, now);

    const idx = state.items.findIndex(
      (i) => i.productId === item.productId && i.variantId === item.variantId,
    );

    if (idx >= 0) {
      state.items[idx] = item;
    } else {
      state.items.push(item);
    }

    state.updatedAt = now;
    this.carts.set(userId, state);
  }

  async removeItem(
    userId: string,
    productId: string,
    variantId: string,
  ): Promise<void> {
    const state = this.carts.get(userId);
    if (!state) return;

    state.items = state.items.filter(
      (i) => !(i.productId === productId && i.variantId === variantId),
    );
    state.updatedAt = new Date().toISOString();
    this.carts.set(userId, state);
  }

  async updateCartMeta(
    userId: string,
    data: {
      itemCount: number;
      cartTotal: number;
      discount?: CartDiscount;
      expiresAt: number;
    },
  ): Promise<void> {
    const now = new Date().toISOString();
    const state = this.ensureState(userId, now);

    state.itemCount = data.itemCount;
    state.cartTotal = data.cartTotal;
    state.discount = data.discount;
    state.expiresAt = data.expiresAt;
    state.updatedAt = now;

    this.carts.set(userId, state);
  }

  async clearCart(userId: string): Promise<void> {
    this.carts.delete(userId);
  }

  private ensureState(userId: string, now: string): CartState {
    return (
      this.carts.get(userId) ?? {
        userId,
        items: [],
        itemCount: 0,
        cartTotal: 0,
        expiresAt: Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60,
        createdAt: now,
        updatedAt: now,
      }
    );
  }
}
