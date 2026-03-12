import 'dotenv/config';
import { connectRabbitMQ } from '../services/rabbitmq.service.js';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { AnalyticsService } from '../analytics/analytics.service.js';
import { connectMongo } from '../config/mongo.js';
import { stripe } from '../config/stripe.js';
import { Order } from '../domain/order.type.js';
import { cartRepository } from '../repositories/cart.repository.factory.js';
import { DynamoOrderRepository } from '../repositories/order.repository.dynamo.js';
import { DynamoPaymentRepository } from '../repositories/payment.repository.dynamo.js';
import { PaymentService } from '../services/payment.service.js';
import { publishEvent } from '../services/rabbitmq.service.js';
import { generateOrderNumber } from '../utils/order-number.js';
import { env } from '../config/env.js';

async function processCheckoutRequested(
  userId: string,
  addressId: string,
  paymentMethod: 'STRIPE' | 'COD',
): Promise<void> {
  const orderRepository = new DynamoOrderRepository();
  const paymentService = new PaymentService(new DynamoPaymentRepository());
  const analyticsService = new AnalyticsService();

  const existingOrder = await orderRepository.getPendingOrderByUser(userId);
  // Only block if there's an active PLACED order that hasn't expired
  if (
    existingOrder &&
    existingOrder.fulfillmentStatus === 'PLACED' &&
    existingOrder.paymentStatus === 'PENDING' &&
    existingOrder.reservationExpiresAt &&
    new Date(existingOrder.reservationExpiresAt) > new Date()
  ) {
    console.log(
      `Skipping checkout for ${userId}: active pending order ${existingOrder.orderId} exists`,
    );
    return;
  }

  await analyticsService.trackCheckoutStarted();

  const cart = await cartRepository.getCart(userId);
  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const addressRes = await axios.get(
    `${env.userServiceUrl}/address/${addressId}`,
    { headers: { 'x-user-id': userId } },
  );
  const addressSnapshot = addressRes.data?.data ?? addressRes.data;

  const availableItems = [];
  const unavailableItems = [];

  for (const item of cart.items) {
    const stockRes = await axios.get(
      `${env.productServiceUrl}/product/stocks/${item.variantId}`,
    );

    if (!stockRes.data || stockRes.data.available < item.quantity) {
      unavailableItems.push(item);
    } else {
      availableItems.push(item);
    }
  }

  if (availableItems.length === 0) {
    throw new Error('All items are out of stock');
  }

  if (unavailableItems.length > 0) {
    throw new Error('Some items are unavailable. Remove them to continue.');
  }

  const now = new Date().toISOString();
  const orderId = `ORD-${uuid()}`;
  const orderNumber = await generateOrderNumber();

  let subtotal = 0;
  const orderItems: Order['items'] = [];

  for (const item of availableItems) {
    const priceRes = await axios.get(
      `${env.productServiceUrl}/product/price/${item.productId}`,
    );

    const finalPrice = priceRes.data?.finalPrice ?? priceRes.data?.finalprice;
    const price = Number(finalPrice);

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error(`Invalid price for product ${item.productId}`);
    }

    const itemSubtotal = price * item.quantity;
    subtotal += itemSubtotal;

    orderItems.push({
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price,
      subtotal: itemSubtotal,
      attributes: item.attributes,
    });
  }

  const order: Order = {
    orderId,
    orderNumber,
    userId,
    addressSnapshot,
    items: orderItems,
    subtotal,
    totalAmount: subtotal,
    currency: 'INR',
    paymentMethod,
    paymentStatus: 'PENDING',
    fulfillmentStatus: 'PLACED',
    createdAt: now,
    updatedAt: now,
  };

  await orderRepository.createOrder(order);

  const paymentIntentMetadata = {
    orderId,
    userId,
    items: JSON.stringify(
      order.items.map((item) => ({
        versionId: item.variantId,
        quantity: item.quantity,
      })),
    ),
  };

  const paymentIntent =
    paymentMethod === 'STRIPE'
      ? await stripe.paymentIntents.create({
          amount: Math.round(order.totalAmount * 100),
          currency: 'inr',
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: paymentIntentMetadata,
        })
      : null;

  const payment = await paymentService.createPendingPayment(
    order.orderId,
    userId,
    order.totalAmount,
    order.currency,
    paymentMethod,
    paymentIntent?.id,
  );

  await orderRepository.updatePaymentId(order.orderId, payment.paymentId);

  const stockItems = order.items.map((item) => ({
    variantId: item.variantId,
    quantity: item.quantity,
  }));

  await publishEvent('order.created', {
    orderId: order.orderId,
    userId: order.userId,
    items: stockItems,
  });

  await publishEvent('stock.reserve', {
    orderId: order.orderId,
    items: stockItems,
  });

  // Clear the cart after order is successfully created
  await cartRepository.clearCart(userId);
  console.log(`Cart cleared for user ${userId} after order ${order.orderId}`);
}

async function startWorker() {
  await connectMongo();

  const channel = await connectRabbitMQ();
  await channel.prefetch(1);

  console.log('checkout worker running');

  channel.consume('checkout_queue', async (msg) => {
    if (!msg) {
      return;
    }

    try {
      const data = JSON.parse(msg.content.toString());

      if (data.event === 'checkout.requested') {
        const { userId, addressId, paymentMethod } = data.payload;
        await processCheckoutRequested(userId, addressId, paymentMethod);
      }

      channel.ack(msg);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error(
        'checkout worker failed to process message:',
        errMsg,
        error,
      );
      // requeue: false — drop to dead-letter rather than requeue forever
      channel.nack(msg, false, false);
    }
  });

  // Keep the process alive — channel.consume() is non-blocking
  await new Promise<never>(() => {
    process.on('SIGTERM', () => {
      console.log('checkout worker shutting down');
      process.exit(0);
    });
    process.on('SIGINT', () => {
      console.log('checkout worker shutting down');
      process.exit(0);
    });
  });
}

startWorker().catch((error) => {
  console.error('checkout worker failed to start', error);
  process.exit(1);
});
