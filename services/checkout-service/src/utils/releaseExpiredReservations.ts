import axios from 'axios';
import { DynamoOrderRepository } from '../repositories/order.repository.dynamo.js';
const orderRepo = new DynamoOrderRepository();
export async function releaseExpiredReservations() {
  const expiredOrders = await orderRepo.getExpiredPendingOrders();

  for (const order of expiredOrders) {
    for (const item of order.items) {
      await axios.post(
        `${process.env.PRODUCT_SERVICE_URL}/product/stocks/release`,
        {
          versionId: item.variantId,
          quantity: item.quantity,
        },
      );
    }

    await orderRepo.updatePaymentStatus(order.orderId, 'FAILED');
  }
}
