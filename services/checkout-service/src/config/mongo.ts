import mongoose from 'mongoose';
import { env } from './env.js';

export const connectMongo = async () => {
  try {
    await mongoose.connect(env.mongoUri);

    console.log(' MongoDB connected for analytics');
  } catch (error) {
    console.error(' MongoDB connection failed', error);
    process.exit(1);
  }
};
