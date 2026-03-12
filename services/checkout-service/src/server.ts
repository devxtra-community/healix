import app from './app.js';
import { checkoutDBEvents, connectDB } from './config/db.js';
import { env } from './config/env.js';
import { connectMongo } from './config/mongo.js';
import { connectRabbitMQ } from './services/rabbitmq.service.js';

async function bootstrap() {
  checkoutDBEvents();
  await connectDB();
  await connectMongo();
  await connectRabbitMQ();

  app.listen(env.port, () => {
    console.log(`checkout service running on ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('checkout service failed to start', error);
  process.exit(1);
});
