import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '../config/db.js';
import { OrderRespository } from './order.repository.js';
import { Order } from '../domain/order.type.js';

const TABLE_NAME = 'OrderTable';
export class DynamoOrderRepository implements OrderRespository {
  async createOrder(order: Order): Promise<void> {
    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          PK: `ORDER#${order.orderId}`,
          SK: `ORDER#${order.orderId}`,
          GSI1PK: `USER#${order.userId}`,
          GSI1SK: `ORDER#${order.createdAt}`,
          ...order,
        },
      }),
    );
  }

  async getOrder(orderId: string): Promise<Order | null> {
    const res = await dynamoDB.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `ORDER#${orderId}`,
          SK: `ORDER#${orderId}`,
        },
      }),
    );

    return (res.Item as Order) ?? null;
  }
  async getUserOrders(userId: string): Promise<Order[]> {
    const res = await dynamoDB.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
        },
      }),
    );
    return (res.Items as Order[]) ?? [];
  }

  async getAllOrders(): Promise<Order[]> {
    const res = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      }),
    );

    return (res.Items as Order[]) ?? [];
  }
  async updatePaymentStatus(
    orderId: string,
    status: 'PENDING' | 'SUCCESS' | 'FAILED',
  ): Promise<void> {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `ORDER#${orderId}`,
          SK: `ORDER#${orderId}`,
        },
        UpdateExpression: `
          SET paymentStatus = :status,
              updatedAt = :now
        `,
        ExpressionAttributeValues: {
          ':status': status,
          ':now': new Date().toISOString(),
        },
      }),
    );
  }
  async updatePaymentId(orderId: string, paymentId: string): Promise<void> {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `ORDER#${orderId}`,
          SK: `ORDER#${orderId}`,
        },
        UpdateExpression: `
        SET paymentId = :pid,
            updatedAt = :now
      `,
        ExpressionAttributeValues: {
          ':pid': paymentId,
          ':now': new Date().toISOString(),
        },
      }),
    );
  }

  async updateFulfillmentStatus(
    orderId: string,
    status: 'PLACED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
  ): Promise<void> {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `ORDER#${orderId}`,
          SK: `ORDER#${orderId}`,
        },
        UpdateExpression: 'SET fulfillmentStatus = :status, updatedAt = :now',
        ExpressionAttributeValues: {
          ':status': status,
          ':now': new Date().toISOString(),
        },
      }),
    );
  }
  async setReservationExpiry(orderId: string, expiresAt: string) {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `ORDER#${orderId}`,
          SK: `ORDER#${orderId}`,
        },
        UpdateExpression: `
        SET reservationExpiresAt = :exp
      `,
        ExpressionAttributeValues: {
          ':exp': expiresAt,
        },
      }),
    );
  }

  async getExpiredPendingOrders(): Promise<Order[]> {
    const now = new Date().toISOString();

    const res = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression:
          'paymentStatus = :pending AND reservationExpiresAt < :now',
        ExpressionAttributeValues: {
          ':pending': 'PENDING',
          ':now': now,
        },
      }),
    );

    return (res.Items as Order[]) ?? [];
  }

  async getPendingOrderByUser(userId: string): Promise<Order | null> {
    const res = await dynamoDB.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        FilterExpression: 'paymentStatus = :status',
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
          ':status': 'PENDING',
        },
      }),
    );

    return (res.Items?.[0] as Order) ?? null;
  }
  async cancelOrder(orderId: string): Promise<void> {
  await dynamoDB.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ORDER#${orderId}`,
        SK: `ORDER#${orderId}`,
      },
      ConditionExpression: `
        fulfillmentStatus <> :cancelled
        AND fulfillmentStatus <> :shipped
        AND fulfillmentStatus <> :delivered
      `,
      UpdateExpression: `
        SET fulfillmentStatus = :cancelled,
            updatedAt = :now
      `,
      ExpressionAttributeValues: {
        ':cancelled': 'CANCELLED',
        ':shipped': 'SHIPPED',
        ':delivered': 'DELIVERED',
        ':now': new Date().toISOString(),
      },
    }),
  );
}
}
