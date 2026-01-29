import { PutCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '../config/db.js';
import { PaymentRepository } from './payment.repository.js';
import { Payment } from '../domain/payment.types.js';

const TABLE_NAME = 'PaymentTable';

export class DynamoPaymentRepository implements PaymentRepository {
  async create(payment: Payment): Promise<void> {
    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          PK: `ORDER#${payment.orderId}`,
          SK: `PAYMENT#${payment.paymentId}`,
          ...payment,
        },
      }),
    );
  }
  async updateStatus(
    paymentId: string,
    status: Payment['status'],
  ): Promise<void> {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `PAYMENT#${paymentId}`,
          SK: `PAYMENT#${paymentId}`,
        },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
        },
      }),
    );
  }
  async getByPaymentIntent(paymentIntentId: string): Promise<Payment | null> {
    const res = await dynamoDB.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'paymentIntent-index',
        KeyConditionExpression: 'stripePaymentIntentId = :pid',
        ExpressionAttributeValues: {
          ':pid': paymentIntentId,
        },
      }),
    );
    return (res.Items?.[0] as Payment) ?? null;
  }
}
