import { Order } from '../domain/order.type.js';
export interface OrderRespository {
  createOrder(order: Order): Promise<void>;
  getOrder(orderId: string): Promise<Order | null>;
  getUserOrders(userId: string): Promise<Order[]>;

  getAllOrders(): Promise<Order[]>;
  updatePaymentStatus(
    orderId: string,
    status: 'PENDING' | 'SUCCESS' | 'FAILED',
  ): Promise<void>;

  updatePaymentId(orderId: string, paymentId: string): Promise<void>;

  updateFulfillmentStatus(
    orderId: string,
    status: 'PLACED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
  ): Promise<void>;

  setReservationExpiry(orderId: string, expiresAt: string): Promise<void>;

  getExpiredPendingOrders(): Promise<Order[]>;

  getPendingOrderByUser(userId: string): Promise<Order | null>;
}
