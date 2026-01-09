import { Schema, model, Types, Document } from 'mongoose';

export interface IProductDetails extends Document {
  product_version_id: Types.ObjectId;

  nutrition_facts: {
    serving_size?: string;
    calories?: number;
    macros?: {
      protein?: number;
      carbs?: number;
      fat?: number;
      fiber?: number;
    };
    vitamins?: Record<string, string>;
    minerals?: Record<string, string>;
  };

  ingredients: {
    name: string;
    origin?: string;
    organic?: boolean;
  }[];

  benefits?: string[];
  suitable_for?: string[];

  created_at: Date;
  updated_at: Date;
}

const ProductDetailsSchema = new Schema<IProductDetails>(
  {
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
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export const ProductDetailsModel = model<IProductDetails>(
  'ProductDetails',
  ProductDetailsSchema,
);
