import adminApi from '../lib/axios.admin';
import { AdminOrder } from '../types/api/order.api';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeOrder = (value: unknown): AdminOrder | null => {
  if (!isRecord(value)) return null;

  const orderId =
    typeof value.orderId === 'string'
      ? value.orderId
      : typeof value.PK === 'string' && value.PK.startsWith('ORDER#')
        ? value.PK.replace('ORDER#', '')
        : '';

  if (!orderId) return null;

  return {
    orderId,
    orderNumber:
      typeof value.orderNumber === 'string' && value.orderNumber
        ? value.orderNumber
        : orderId,
    userId: typeof value.userId === 'string' ? value.userId : 'Unknown user',
    addressSnapshot: isRecord(value.addressSnapshot)
      ? value.addressSnapshot
      : undefined,
    items: Array.isArray(value.items)
      ? (value.items as AdminOrder['items'])
      : [],
    subtotal: typeof value.subtotal === 'number' ? value.subtotal : 0,
    totalAmount: typeof value.totalAmount === 'number' ? value.totalAmount : 0,
    currency: typeof value.currency === 'string' ? value.currency : 'INR',
    paymentMethod:
      value.paymentMethod === 'STRIPE' || value.paymentMethod === 'COD'
        ? value.paymentMethod
        : undefined,
    paymentId:
      typeof value.paymentId === 'string' ? value.paymentId : undefined,
    paymentStatus:
      value.paymentStatus === 'SUCCESS' ||
      value.paymentStatus === 'FAILED' ||
      value.paymentStatus === 'PENDING'
        ? value.paymentStatus
        : 'PENDING',
    fulfillmentStatus:
      value.fulfillmentStatus === 'PACKED' ||
      value.fulfillmentStatus === 'SHIPPED' ||
      value.fulfillmentStatus === 'DELIVERED' ||
      value.fulfillmentStatus === 'CANCELLED' ||
      value.fulfillmentStatus === 'PLACED'
        ? value.fulfillmentStatus
        : 'PLACED',
    createdAt:
      typeof value.createdAt === 'string' && value.createdAt
        ? value.createdAt
        : new Date(0).toISOString(),
    updatedAt:
      typeof value.updatedAt === 'string' && value.updatedAt
        ? value.updatedAt
        : new Date(0).toISOString(),
  };
};

export const adminOrderService = {
  getAllOrders: async (): Promise<AdminOrder[]> => {
    const res = await adminApi.get<
      unknown[] | { data?: unknown[]; orders?: unknown[] }
    >('/order/admin/all');

    const rawOrders = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.orders)
          ? res.data.orders
          : [];

    return rawOrders
      .map((order) => normalizeOrder(order))
      .filter((order): order is AdminOrder => order !== null);
  },
};
