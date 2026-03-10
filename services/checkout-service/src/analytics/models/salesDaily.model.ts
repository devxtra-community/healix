import mongoose from 'mongoose';

const salesDailySchema = new mongoose.Schema({
  date: { type: String, unique: true },

  revenue: { type: Number, default: 0 },

  orders: { type: Number, default: 0 },

  refunds: { type: Number, default: 0 },
});

export const SalesDaily = mongoose.model('SalesDaily', salesDailySchema);
