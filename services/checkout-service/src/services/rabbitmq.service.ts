import amqp, { Channel } from 'amqplib';

const AMQP_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

const EVENT_QUEUE_MAP: Record<string, string> = {
  'checkout.requested': 'checkout_queue',
  'order.created': 'order_queue',
  'order.cancelled': 'order_queue',
  'stock.reserve': 'stock_queue',
  'stock.release': 'stock_queue',
};

const QUEUES = [...new Set(Object.values(EVENT_QUEUE_MAP))];

let channel: Channel | null = null;

export async function connectRabbitMQ(): Promise<Channel> {
  if (channel) {
    return channel;
  }

  const conn = await amqp.connect(AMQP_URL);

  conn.on('error', (err: Error) => {
    console.error('RabbitMQ connection error:', err.message);
    channel = null;
  });

  conn.on('close', () => {
    console.warn('RabbitMQ connection closed. Will reconnect on next publish.');
    channel = null;
  });

  const ch = await conn.createChannel();
  channel = ch;

  ch.on('error', (err: Error) => {
    console.error('RabbitMQ channel error:', err.message);
    channel = null;
  });

  ch.on('close', () => {
    console.warn('RabbitMQ channel closed.');
    channel = null;
  });

  for (const queue of QUEUES) {
    await ch.assertQueue(queue, { durable: true });
  }

  console.log('RabbitMQ connected');
  return ch;
}

export async function publishEvent(
  event: string,
  payload: unknown,
): Promise<void> {
  const queue = EVENT_QUEUE_MAP[event];

  if (!queue) {
    throw new Error(`No RabbitMQ queue configured for event: ${event}`);
  }

  const activeChannel = await connectRabbitMQ();
  const message = { event, payload };

  activeChannel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
}
