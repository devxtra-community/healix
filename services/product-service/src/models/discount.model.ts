import { Schema, model } from 'mongoose';

export interface IDiscount {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  max_discount?: number;
  min_order_value?: number;
  usage_limit?: number;
  used_count: number;
  user_limit?: number;
  start_date: Date;
  end_date: Date;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const DiscountSchema = new Schema<IDiscount>(
  {
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
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export const DiscountModel = model<IDiscount>('Discount', DiscountSchema);
