import {
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '../config/db.js';
import { RefundRepository } from './refund.repository.js';
import { Refund } from '../domain/payment.types.js';

const TABLE_NAME = 'RefundTable';

export class DynamoRefundRepository implements RefundRepository {
  async create(refund: Refund): Promise<void> {
    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          PK: `ORDER#${refund.orderId}`,
          SK: `REFUND#${refund.refundId}`,
          ...refund,
        },
      }),
    );
  }

  async updateStatus(
  orderId: string,
  refundId: string,
  status: Refund['status'],
  stripeRefundId?: string,
): Promise<void> {
  await dynamoDB.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ORDER#${orderId}`,
        SK: `REFUND#${refundId}`,
      },
      UpdateExpression: `
        SET #status = :status,
            stripeRefundId = :stripeId,
            updatedAt = :now
      `,
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':stripeId': stripeRefundId ?? null,
        ':now': new Date().toISOString(),
      },
    }),
  );
}


  async getByOrder(orderId: string): Promise<Refund[]> {
    const res = await dynamoDB.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `ORDER#${orderId}`,
        },
      }),
    );

    return (res.Items as Refund[]) ?? [];
  }
}
