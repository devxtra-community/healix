import { ProductRepository } from '../repositories/product.repositories.js';
import { PricingRepository } from '../repositories/pricing.repositories.js';
import { startSession, Types } from 'mongoose';
import { IDiscount } from '../models/discount.model.js';
import { StockRepository } from '../repositories/stock.repositories.js';

export class PricingService {
  constructor(
    private productRepository: ProductRepository,
    private pricingRepository: PricingRepository,
    private readonly stockRepository: StockRepository,
  ) {}

  async setBasePrice(productId: string, newPrice: number) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product Id');
    }

    if (newPrice <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const product = await this.productRepository.getProduct(productId);

    if (!product?.current_version_id || !product.details) {
      throw new Error('Product data incomplete');
    }

    const {
      _id: versionId,
      price: ignorePrice,
      ...versionData
    } = product.current_version_id;

    const { _id: ignoreDetailsId, ...detailsData } = product.details;

    // Explicitly mark as used
    void ignorePrice;
    void ignoreDetailsId;

    const session = await startSession();

    try {
      await session.startTransaction();

      const newVersion = await this.productRepository.createNewVersion(
        productId,
        {
          ...versionData,
          price: newPrice,
        },
        detailsData,
        session,
      );

      await this.stockRepository.updateStock(
        versionId,
        newVersion._id,
        session,
      );

      await session.commitTransaction();

      return newVersion;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async createDiscount(
    data: Omit<IDiscount, 'used_count' | 'created_at' | 'updated_at'>,
  ) {
    if (data.value <= 0) {
      throw new Error('Invalid discount value');
    }
    if (data.start_date >= data.end_date) {
      throw new Error('Invalid discount date range');
    }
    return this.pricingRepository.createDiscount(data);
  }
  async getActivePrice(productId: string) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product id');
    }
    const product = await this.productRepository.getProduct(productId);
    if (!product) return null;
    const basePrice = product.current_version_id.price;
    const discount = await this.pricingRepository.findActiveDiscount();
    if (!discount) {
      return {
        finalprice: basePrice,
        originalPrice: basePrice,
        discount: 0,
      };
    }
    let finalprice = basePrice;
    if (discount.type === 'percentage') {
      finalprice = basePrice - (basePrice * discount.value) / 100;
    } else {
      finalprice = basePrice - discount.value;
    }
    if (discount.max_discount) {
      finalprice = Math.max(basePrice - discount.max_discount, finalprice);
    }
    return {
      finalPrice: Math.max(finalprice, 0),
      originalPrice: basePrice,
      discount: discount.value,
    };
  }
}
