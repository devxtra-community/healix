import { DiscountModel, IDiscount } from '../models/discount.model.js';

export class PricingRepository {
  async findActiveDiscount() {
    return DiscountModel.findOne({
      active: true,
      start_date: { $lte: new Date() },
      end_date: { $gte: new Date() },
    });
  }
  async createDiscount(
    data: Omit<IDiscount, 'used_count' | 'created_at' | 'updated_at'>,
  ): Promise<IDiscount> {
    return DiscountModel.create({
      ...data,
      used_count: 0,
    });
  }
}
