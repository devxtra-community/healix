import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { env } from './env.js';
console.log('DYNAMO REGION:', env.awsRegion);

const client = new DynamoDBClient({
  region: env.awsRegion,
  ...(env.dynamoEndpoint && {
    endpoint: env.dynamoEndpoint,
    credentials: {
      accessKeyId: env.accessKeyId!,
      secretAccessKey: env.secretAccessKey!,
    },
  }),
});
export const connectDB = async () => {
  try {
    console.log(' DynamoDB client initialized');
  } catch (error) {
    console.error('DynamoDB connection failed', error);
    process.exit(1);
  }
};
export const checkoutDBEvents = () => {
  console.log('Checkout DB events registered');
};
export const dynamoDB = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});
