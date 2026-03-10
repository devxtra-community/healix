import mongoose from 'mongoose';

const funnelStatsSchema = new mongoose.Schema({
  date: { type: String, unique: true },

  productViews: {
    type: Number,
    default: 0,
  },

  addToCart: {
    type: Number,
    default: 0,
  },

  checkoutStarted: {
    type: Number,
    default: 0,
  },

  ordersCompleted: {
    type: Number,
    default: 0,
  },
});

export const FunnelStats = mongoose.model('FunnelStats', funnelStatsSchema);
