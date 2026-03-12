import { DiscountModel } from '../models/discount.model.js';
export class PricingRepository {
    async getAllDiscounts() {
        return DiscountModel.find().sort({ created_at: -1 });
    }
    async getDiscountById(id) {
        return DiscountModel.findById(id);
    }
    async findActiveDiscount() {
        return DiscountModel.findOne({
            active: true,
            start_date: { $lte: new Date() },
            end_date: { $gte: new Date() },
        });
    }
    async createDiscount(data) {
        return DiscountModel.create({
            ...data,
            used_count: 0,
        });
    }
    async findValidDiscountByCode(code) {
        return DiscountModel.findOne({
            code: code.toUpperCase(),
            active: true,
            start_date: { $lte: new Date() },
            end_date: { $gte: new Date() },
        });
    }
    async updateDiscount(id, data) {
        return DiscountModel.findByIdAndUpdate(id, data, {
            new: true,
        });
    }
    async deleteDiscount(id) {
        return DiscountModel.findByIdAndDelete(id);
    }
}
