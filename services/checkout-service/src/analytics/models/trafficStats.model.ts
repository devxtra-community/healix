import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  date: String,

  source: String,

  visits: Number,
});

export const TrafficStats = mongoose.model('TrafficStats', schema);
