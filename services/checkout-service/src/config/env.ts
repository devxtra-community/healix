import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4003),
  awsRegion: process.env.AWS_REGION || 'ap-south-1',
  dynamoEndpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  stripeSecretKey:   process.env.STRIPE_SECRET_KEY!,
  stripeWebHookSecretKey: process.env.STRIPE_WEBHOOK_SECRET!,
  redis_url: process.env.REDIS_URL
};
