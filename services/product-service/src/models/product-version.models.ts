import { Schema, model, Types } from 'mongoose';

export type ProductStatus =
  | 'active'
  | 'inactive'
  | 'out-of-stock'
  | 'coming-soon'
  | 'discontinued';

export interface IProductVersion {
  _id: Types.ObjectId;
  product_id: Types.ObjectId;
  version: number;
  name: string;
  description?: string;
  brand?: string;
  tags?: string[];
  price: number;
  images: string[];
  status: ProductStatus;

  attributes: {
    flavor?: string;
    pack_size?: string;
    form?: 'powder' | 'capsule' | 'liquid' | 'bar';
  };

  ratings: {
    count: number;
    average: number;
  };

  created_at: Date;
}

const ProductVersionSchema = new Schema<IProductVersion>(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },

    version: { type: Number, required: true },

    name: { type: String, required: true },
    description: String,
    brand: String,
    tags: [String],

    price: { type: Number, required: true },
    images: [String],

    status: {
      type: String,
      enum: [
        'active',
        'inactive',
        'out-of-stock',
        'coming-soon',
        'discontinued',
      ],
      default: 'active',
    },

    attributes: {
      flavor: String,
      pack_size: String,
      form: {
        type: String,
        enum: ['powder', 'capsule', 'liquid', 'bar'],
      },
    },

    ratings: {
      count: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  },
);

ProductVersionSchema.index({ product_id: 1, version: -1 });

export const ProductVersionModel = model<IProductVersion>(
  'ProductVersion',
  ProductVersionSchema,
);
