import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  productId: String,

  views: { type: Number, default: 0 },

  sold: { type: Number, default: 0 },

  revenue: { type: Number, default: 0 },
});

export const ProductStats = mongoose.model('ProductStats', schema);
