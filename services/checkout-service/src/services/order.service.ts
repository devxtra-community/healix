import { OrderRespository } from '../repositories/order.repository.js';
import { RefundService } from './refund.service.js';
import axios from 'axios';

type FulfillmentStatus =
  | 'PLACED'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';
export class OrderService {
  constructor(
    private orderRepo: OrderRespository,
    private refundService: RefundService,
  ) {}
  getuserOrder(userId: string) {
    return this.orderRepo.getUserOrders(userId);
  }
  getOrder(orderId: string) {
    return this.orderRepo.getOrder(orderId);
  }
  getAllorders() {
    return this.orderRepo.getAllOrders();
  }
  updateFullfillmentStatus(orderId: string, status: FulfillmentStatus) {
    return this.orderRepo.updateFulfillmentStatus(orderId, status);
  }

  async markPaid(orderId: string) {
    await this.orderRepo.updatePaymentStatus(orderId, 'SUCCESS');
  }

  async markPaymentFailed(orderId: string) {
    await this.orderRepo.updatePaymentStatus(orderId, 'FAILED');
  }
  async markFailed(orderId: string) {
    await this.orderRepo.updatePaymentStatus(orderId, 'FAILED');
  }
  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderRepo.getOrder(orderId);
    if (!order || order.userId !== userId) {
      throw new Error('Order not found');
    }

    try {
      await this.orderRepo.cancelOrder(orderId);
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.name === 'ConditionalCheckFailedException'
      ) {
        // idempotent cancel → silently succeed
        return;
      }
      throw err;
    }

    // RELEASE STOCK
    for (const item of order.items) {
      await axios.post(
        `${process.env.PRODUCT_SERVICE_URL}/product/stocks/release`,
        item,
      );
    }

    // REFUND ONLY IF PAID
    if (order.paymentStatus === 'SUCCESS' && order.paymentId) {
      await this.refundService.createRefund(order);
    }
  }
}
