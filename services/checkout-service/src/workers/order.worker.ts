import 'dotenv/config';
import { connectRabbitMQ } from '../services/rabbitmq.service.js';
import { connectMongo } from '../config/mongo.js';
import { AnalyticsService } from '../analytics/analytics.service.js';
import { DynamoOrderRepository } from '../repositories/order.repository.dynamo.js';
import { DynamoPaymentRepository } from '../repositories/payment.repository.dynamo.js';
import { DynamoRefundRepository } from '../repositories/refund.repository.dynamo.js';
import { RefundService } from '../services/refund.service.js';
import { publishEvent } from '../services/rabbitmq.service.js';

async function handleOrderCreated(payload: {
  orderId: string;
  userId: string;
  items: Array<{ variantId: string; quantity: number }>;
}) {
  const orderRepository = new DynamoOrderRepository();
  const analyticsService = new AnalyticsService();
  const order = await orderRepository.getOrder(payload.orderId);

  if (!order) {
    throw new Error(`Order not found: ${payload.orderId}`);
  }

  await analyticsService.trackOrder(order);
  console.log(`order.created analytics tracked for ${payload.orderId}`);
  console.log(`notification triggered for order ${payload.orderId}`);
}

async function handleOrderCancelled(payload: {
  orderId: string;
  userId: string;
  items: Array<{ variantId: string; quantity: number }>;
}) {
  const orderRepository = new DynamoOrderRepository();
  const paymentRepository = new DynamoPaymentRepository();
  const refundRepository = new DynamoRefundRepository();
  const refundService = new RefundService(refundRepository, paymentRepository);
  const order = await orderRepository.getOrder(payload.orderId);

  if (!order || order.userId !== payload.userId) {
    throw new Error(`Order not found: ${payload.orderId}`);
  }

  try {
    await orderRepository.cancelOrder(payload.orderId);
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.name === 'ConditionalCheckFailedException'
    ) {
      return;
    }
    throw err;
  }

  if (order.paymentStatus === 'SUCCESS' && order.paymentId) {
    await refundService.createRefund(order);
  }

  await publishEvent('stock.release', {
    orderId: payload.orderId,
    items: payload.items,
  });
}

async function startWorker() {
  await connectMongo();

  const channel = await connectRabbitMQ();
  if (!channel) {
    console.warn('order worker bypassing: RabbitMQ unavailable');
    return;
  }
  await channel.prefetch(1);

  console.log('order worker running');

  channel.consume('order_queue', async (msg) => {
    if (!msg) {
      return;
    }

    try {
      const data = JSON.parse(msg.content.toString());

      if (data.event === 'order.created') {
        await handleOrderCreated(data.payload);
      }

      if (data.event === 'order.cancelled') {
        await handleOrderCancelled(data.payload);
      }

      channel.ack(msg);
    } catch (error) {
      console.error('order worker failed to process message', error);
      // requeue: false — drop to dead-letter rather than requeue forever
      channel.nack(msg, false, false);
    }
  });

  // Keep the process alive — channel.consume() is non-blocking
  await new Promise<never>(() => {
    process.on('SIGTERM', () => {
      console.log('order worker shutting down');
      process.exit(0);
    });
    process.on('SIGINT', () => {
      console.log('order worker shutting down');
      process.exit(0);
    });
  });
}

startWorker().catch((error) => {
  console.error('order worker failed to start', error);
  process.exit(1);
});
