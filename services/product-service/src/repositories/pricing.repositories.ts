import { DiscountModel, IDiscount } from '../models/discount.model.js';

export class PricingRepository {
  async getAllDiscounts() {
    return DiscountModel.find().sort({ created_at: -1 });
  }

  async getDiscountById(id: string) {
    return DiscountModel.findById(id);
  }

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

  async findValidDiscountByCode(code: string) {
    return DiscountModel.findOne({
      code: code.toUpperCase(),
      active: true,
      start_date: { $lte: new Date() },
      end_date: { $gte: new Date() },
    });
  }

  async updateDiscount(id: string, data: Partial<IDiscount>) {
    return DiscountModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteDiscount(id: string) {
    return DiscountModel.findByIdAndDelete(id);
  }
}
