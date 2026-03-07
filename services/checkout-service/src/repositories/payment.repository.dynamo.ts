import {
  PutCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
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
    orderId: string,
    paymentId: string,
    status: Payment['status'],
  ): Promise<void> {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `ORDER#${orderId}`,
          SK: `PAYMENT#${paymentId}`,
        },
        UpdateExpression: `
        SET #status = :status,
            updatedAt = :now
      `,
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':now': new Date().toISOString(),
        },
      }),
    );
  }

  async getByPaymentIntent(paymentIntentId: string): Promise<Payment | null> {
    try {
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
    } catch (error) {
      const isMissingIndex =
        error instanceof Error &&
        error.name === 'ValidationException' &&
        error.message.includes('specified index');

      if (!isMissingIndex) {
        throw error;
      }

      const fallback = await dynamoDB.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: 'stripePaymentIntentId = :pid',
          ExpressionAttributeValues: {
            ':pid': paymentIntentId,
          },
          Limit: 1,
        }),
      );

      return (fallback.Items?.[0] as Payment) ?? null;
    }
  }
  async getByOrder(orderId: string): Promise<Payment | null> {
    const res = await dynamoDB.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `ORDER#${orderId}`,
        },
        Limit: 1,
      }),
    );

    return (res.Items?.[0] as Payment) ?? null;
  }
}
