import 'dotenv/config';
import axios from 'axios';
import { connectMongo } from '../config/mongo.js';
import { connectRabbitMQ } from '../services/rabbitmq.service.js';
import { DynamoOrderRepository } from '../repositories/order.repository.dynamo.js';
import { env } from '../config/env.js';

type StockPayload = {
  orderId: string;
  items: Array<{ variantId: string; quantity: number }>;
};

async function handleStockReserve(payload: StockPayload) {
  const orderRepository = new DynamoOrderRepository();

  for (const item of payload.items) {
    await axios.post(`${env.productServiceUrl}/product/stocks/reserve`, {
      versionId: item.variantId,
      quantity: item.quantity,
    });
  }

  const reservationExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000,
  ).toISOString();

  await orderRepository.setReservationExpiry(
    payload.orderId,
    reservationExpiresAt,
  );
}

async function handleStockRelease(payload: StockPayload) {
  for (const item of payload.items) {
    await axios.post(`${env.productServiceUrl}/product/stocks/release`, {
      versionId: item.variantId,
      quantity: item.quantity,
    });
  }
}

async function startWorker() {
  await connectMongo();

  const channel = await connectRabbitMQ();
  await channel.prefetch(1);

  console.log('stock worker running');

  channel.consume('stock_queue', async (msg) => {
    if (!msg) {
      return;
    }

    try {
      const data = JSON.parse(msg.content.toString());

      if (data.event === 'stock.reserve') {
        await handleStockReserve(data.payload);
      }

      if (data.event === 'stock.release') {
        await handleStockRelease(data.payload);
      }

      channel.ack(msg);
    } catch (error) {
      console.error('stock worker failed to process message', error);
      // requeue: false — drop to dead-letter rather than requeue forever
      channel.nack(msg, false, false);
    }
  });

  // Keep the process alive — channel.consume() is non-blocking
  await new Promise<never>(() => {
    process.on('SIGTERM', () => {
      console.log('stock worker shutting down');
      process.exit(0);
    });
    process.on('SIGINT', () => {
      console.log('stock worker shutting down');
      process.exit(0);
    });
  });
}

startWorker().catch((error) => {
  console.error('stock worker failed to start', error);
  process.exit(1);
});
