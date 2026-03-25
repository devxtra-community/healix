import app from './app.js';
import { connectDB, productDBEvents } from './config/db.js';
import { env } from './config/env.js';
productDBEvents();
connectDB();
app.listen(env.port, () => {
  console.log(`Product and catalog service running on ${env.port}`);
});
