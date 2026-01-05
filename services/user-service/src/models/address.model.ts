import { model, Schema, Types } from 'mongoose';

export interface IAddress {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  address_type: 'billing' | 'home' | 'office';
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  created_at: Date;
  updated_at: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    address_type: {
      type: String,
      enum: ['billing', 'home', 'office'],
      required: true,
    },
    address_line1: { type: String, required: true },
    address_line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  },
);

export const Address = model<IAddress>('Address', AddressSchema);
