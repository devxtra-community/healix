import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4002),
  mongoUri: process.env.MONGO_URI || '',
};
