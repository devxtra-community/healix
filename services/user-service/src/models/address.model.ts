import { model, Schema, Types } from 'mongoose';

export interface IAddress {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  addressType: 'billing' | 'home' | 'office';
  addressLine1: string;
  addressLine2?: string;
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
    addressType: {
      type: String,
      enum: ['billing', 'home', 'office'],
      required: true,
    },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
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
