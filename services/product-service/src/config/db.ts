import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 500,
    });
    console.log('MongoDB connected!');
  } catch (err) {
    console.error('Initial MongoDB connection Failed', err);
    process.exit(1);
  }
};
export const productDBEvents = () => {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connection extablished');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB Reconnected');
  });
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB Disconnected... Retry...');
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB Error', err);
  });
};
