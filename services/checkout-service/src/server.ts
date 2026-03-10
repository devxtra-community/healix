import app from './app.js';
import { checkoutDBEvents, connectDB } from './config/db.js';
import { env } from './config/env.js';
import { connectMongo } from './config/mongo.js';

checkoutDBEvents();
connectDB();
connectMongo();

//server
app.listen(env.port, () => {
  console.log(`checkout service running on ${env.port}`);
});
