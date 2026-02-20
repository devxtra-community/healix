import { CartRepository } from '../repositories/cart.repository.js';
import { Cart, CartItem } from '../domain/cart.types.js';
import axios from 'axios';

export class CartService {
  constructor(private cartRepository: CartRepository) {}
  async getCart(userId: string): Promise<Cart | null> {
    return this.cartRepository.getCart(userId);
  }
  async addItem(userId: string, item: CartItem): Promise<void> {
    //  Check product exists & active
    const productRes = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/product/version/${item.variantId}`,
    );

    if (!productRes.data || productRes.data.status !== 'active') {
      throw new Error('Product is no longer available');
    }

    //  Check stock
    const stockRes = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/product/stocks/${item.variantId}`,
    );

    if (!stockRes.data) {
      throw new Error('Stock not found');
    }

    if (stockRes.data.available < item.quantity) {
      throw new Error(`Only ${stockRes.data.available} items available`);
    }

    const priceRes = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/product/price/${item.productId}`,
    );
    if (!priceRes.data?.finalPrice) {
      throw new Error('Price not available');
    }

    const price = Number(priceRes.data.finalPrice);
    const quantity = Number(item.quantity);

    if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
      throw new Error('Invalid price or quantity');
    }

    const now = new Date().toISOString();
const product = productRes.data;   
  const normalizedItem: CartItem = {
    productId: item.productId,
    variantId: item.variantId,

    name: product.name,
    image: product.images?.[0] ?? '',

    price,
    quantity,
    subtotal: price * quantity,

    attributes: item.attributes ?? {},
    addedAt: item.addedAt ?? now,
    updatedAt: now,
  };


    const existingCart = await this.cartRepository.getCart(userId);

    await this.cartRepository.upsertItem(userId, normalizedItem);

    const items = existingCart
      ? [
          ...existingCart.items.filter(
            (i) =>
              !(
                i.productId === item.productId && i.variantId === item.variantId
              ),
          ),
          normalizedItem,
        ]
      : [normalizedItem];

    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    const cartTotal = items.reduce((s, i) => s + i.subtotal, 0);

    await this.cartRepository.updateCartMeta(userId, {
      itemCount,
      cartTotal,
      expiresAt: this.getExpiry(),
    });
  }

  async removeItem(
    userId: string,
    productId: string,
    variantId: string,
  ): Promise<void> {
    await this.cartRepository.removeItem(userId, productId, variantId);

    const updatedCart = await this.cartRepository.getCart(userId);

    if (!updatedCart || updatedCart.items.length === 0) {
      await this.cartRepository.clearCart(userId);
      return;
    }

    const itemCount = updatedCart.items.reduce((sum, i) => sum + i.quantity, 0);

    const cartTotal = updatedCart.items.reduce((sum, i) => sum + i.subtotal, 0);

    await this.cartRepository.updateCartMeta(userId, {
      itemCount,
      cartTotal,
      expiresAt: this.getExpiry(),
    });
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartRepository.clearCart(userId);
  }
  private getExpiry(): number {
    return Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60; // +2 days
  }
}
