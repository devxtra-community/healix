import { Schema, model } from 'mongoose';
const ProductStockSchema = new Schema({
    product_version_id: {
        type: Schema.Types.ObjectId,
        ref: 'ProductVersion',
        required: true,
        unique: true,
        index: true,
    },
    total: { type: Number, required: true },
    reserved: { type: Number, default: 0 },
    available: { type: Number, required: true },
}, { timestamps: true });
export const ProductStockModel = model('ProductStock', ProductStockSchema);
