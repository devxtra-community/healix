import { CartRepository } from '../repositories/cart.repository.js';
import { Cart, CartItem } from '../domain/cart.types.js';
import axios from 'axios';
import { AnalyticsService } from '../analytics/analytics.service.js';

export class CartService {
  constructor(
    private cartRepository: CartRepository,
    private analyticsService: AnalyticsService,
  ) {}
  async getCart(userId: string): Promise<Cart | null> {
    return this.cartRepository.getCart(userId);
  }

  private buildCartMeta(items: CartItem[]) {
    return {
      itemCount: items.reduce((sum, cartItem) => sum + cartItem.quantity, 0),
      cartTotal: items.reduce((sum, cartItem) => sum + cartItem.subtotal, 0),
    };
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

    const finalPrice = priceRes.data?.finalPrice ?? priceRes.data?.finalprice;

    if (!finalPrice) {
      throw new Error('Price not available');
    }

    const price = Number(finalPrice);
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
    const isNewCart = !existingCart || existingCart.items.length === 0;

    await this.cartRepository.upsertItem(userId, normalizedItem);

    // track cart creation only once
    if (isNewCart) {
      await this.analyticsService.trackCartCreated();
    }

    await this.analyticsService.trackAddToCart();

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

    const { itemCount, cartTotal } = this.buildCartMeta(items);

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

    const { itemCount, cartTotal } = this.buildCartMeta(updatedCart.items);

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
