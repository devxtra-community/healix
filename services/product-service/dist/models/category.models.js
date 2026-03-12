import { model, Schema } from 'mongoose';
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    category_type: {
        type: String,
        enum: ['nutrition', 'supplement', 'vitamin', 'superfood', 'herb'],
    },
    health_goal: {
        type: [String],
        enum: [
            'weight-loss',
            'muscle-gain',
            'immunity',
            'gut-health',
            'heart-health',
            'energy',
        ],
        default: [],
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    deleted_at: {
        type: Date,
        default: null,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
CategorySchema.index({ category_type: 1 });
CategorySchema.index({ health_goal: 1 });
export const CategoryModel = model('Category', CategorySchema);
