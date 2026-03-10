import mongoose from 'mongoose';

const cartStatsSchema = new mongoose.Schema({
  date: { type: String, unique: true },

  cartsCreated: {
    type: Number,
    default: 0,
  },

  cartsConverted: {
    type: Number,
    default: 0,
  },
});

export const CartStats = mongoose.model('CartStats', cartStatsSchema);
