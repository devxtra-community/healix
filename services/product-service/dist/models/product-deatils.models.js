import { Schema, model } from 'mongoose';
const ProductDetailsSchema = new Schema({
    product_version_id: {
        type: Schema.Types.ObjectId,
        ref: 'ProductVersion',
        required: true,
        unique: true,
    },
    nutrition_facts: {
        serving_size: String,
        calories: Number,
        macros: {
            protein: Number,
            carbs: Number,
            fat: Number,
            fiber: Number,
        },
        vitamins: Schema.Types.Mixed,
        minerals: Schema.Types.Mixed,
    },
    ingredients: [
        {
            name: String,
            origin: String,
            organic: Boolean,
        },
    ],
    benefits: [String],
    suitable_for: [String],
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
export const ProductDetailsModel = model('ProductDetails', ProductDetailsSchema);
