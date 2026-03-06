import { Schema, model, Types } from 'mongoose';

export interface IProductStock {
  product_version_id: Types.ObjectId;

  total: number; // total inventory
  reserved: number; // reserved for pending orders
  available: number; // total - reserved

  created_at: Date;
  updated_at: Date;
}

const ProductStockSchema = new Schema<IProductStock>(
  {
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
  },
  { timestamps: true },
);

export const ProductStockModel = model<IProductStock>(
  'ProductStock',
  ProductStockSchema,
);
