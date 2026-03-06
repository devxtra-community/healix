import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 4002,
  mongoUri: process.env.MONGO_URI!,

  AWS_REGION: process.env.AWS_REGION!,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY!,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY!,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME!,
};
