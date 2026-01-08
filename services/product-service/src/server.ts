import app from './app';
import { connectDB, productDBEvents } from './config/db';
import { env } from './config/env';
productDBEvents();
connectDB();
app.listen(env.port, () => {
  console.log(`Product and catalog service running on ${env.port}`);
});
