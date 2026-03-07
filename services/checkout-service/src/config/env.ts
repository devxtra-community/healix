import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
if (!stripeSecretKey.startsWith('sk_')) {
  throw new Error(
    'Invalid STRIPE_SECRET_KEY. It must start with "sk_" and match your Stripe account.',
  );
}

export const env = {
  port: Number(process.env.PORT || 4003),
  awsRegion: process.env.AWS_REGION || 'ap-south-1',
  dynamoEndpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  stripeSecretKey,
  stripeWebHookSecretKey: process.env.STRIPE_WEBHOOK_SECRET!,
  redis_url: process.env.REDIS_URL,
  productServiceUrl: process.env.PRODUCT_SERVICE_URL!
};
