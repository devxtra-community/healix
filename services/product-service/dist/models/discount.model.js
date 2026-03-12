import { Schema, model } from 'mongoose';
const DiscountSchema = new Schema({
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ['percentage', 'flat'], required: true },
    value: { type: Number, required: true },
    max_discount: Number,
    min_order_value: Number,
    usage_limit: Number,
    used_count: { type: Number, default: 0 },
    user_limit: Number,
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    active: { type: Boolean, default: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
export const DiscountModel = model('Discount', DiscountSchema);
