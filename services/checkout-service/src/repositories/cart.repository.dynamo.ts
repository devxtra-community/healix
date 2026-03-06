import {
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { CartRepository } from './cart.repository.js';
import {
  Cart,
  CartDiscount,
  CartItem,
  CartItemDynamo,
} from '../domain/cart.types.js';
import { dynamoDB } from '../config/db.js';
console.log('REGION:', process.env.AWS_REGION);

const TABLE_NAME = 'CartTable';

console.log('TABLE:', TABLE_NAME);
export class DynamoCartRepository implements CartRepository {
  async getCart(userId: string): Promise<Cart | null> {
    const res = await dynamoDB.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
        },
      }),
    );

    if (!res.Items || res.Items.length === 0) return null;

    const meta = res.Items.find((i) => i.SK === 'CART');
    if (!meta) return null;

    const itemRows = res.Items.filter(
      (i) => typeof i.SK === 'string' && i.SK.startsWith('ITEM#'),
    );

    return {
      userId,
      items: itemRows.map((i) => this.mapItem(i as CartItemDynamo)),
      itemCount: meta.itemCount,
      cartTotal: meta.cartTotal,
      expiresAt: meta.ttl
        ? new Date(meta.ttl * 1000).toISOString()
        : new Date().toISOString(),

      createdAt: meta.createdAt,
      updatedAt: meta.updatedAt,
    };
  }

  async upsertItem(userId: string, item: CartItem): Promise<void> {
    const now = new Date().toISOString();
    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          PK: `USER#${userId}`,
          SK: `ITEM#${item.productId}#${item.variantId}`,
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,

          attributes: item.attributes,

          addedAt: item.addedAt ?? now,
          updatedAt: now,
        },
      }),
    );
  }
  async removeItem(
    userId: string,
    productId: string,
    variantId: string,
  ): Promise<void> {
    await dynamoDB.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${userId}`,
          SK: `ITEM#${productId}#${variantId}`,
        },
      }),
    );
  }
  async updateCartMeta(
    userId: string,
    data: {
      itemCount: number;
      cartTotal: number;
      discount?: CartDiscount;
      expiresAt: number;
    },
  ): Promise<void> {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${userId}`,
          SK: 'CART',
        },
        UpdateExpression: `
      SET itemCount = :itemCount,
          cartTotal = :cartTotal,
          #ttl = :ttl
    `,
        ExpressionAttributeNames: {
          '#ttl': 'ttl',
        },
        ExpressionAttributeValues: {
          ':itemCount': data.itemCount,
          ':cartTotal': data.cartTotal,
          ':ttl': data.expiresAt,
        },
      }),
    );
  }
  async clearCart(userId: string): Promise<void> {
    const res = await dynamoDB.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
        },
        ProjectionExpression: 'PK, SK',
      }),
    );
    if (!res.Items || res.Items.length === 0) return;

    const deletes = res.Items.map((item) => ({
      DeleteRequest: {
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
      },
    }));

    for (let i = 0; i < deletes.length; i += 25) {
      await dynamoDB.send(
        new BatchWriteCommand({
          RequestItems: {
            [TABLE_NAME]: deletes.slice(i, i + 25),
          },
        }),
      );
    }
  }
  private mapItem(item: CartItemDynamo): CartItem {
    return {
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
      attributes: item.attributes,
      addedAt: item.addedAt,
      updatedAt: item.updatedAt,
    };
  }
}
