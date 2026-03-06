import app from './app.js';
import { checkoutDBEvents, connectDB } from './config/db.js';
import { env } from './config/env.js';

checkoutDBEvents();
connectDB();

app.listen(env.port, () => {
  console.log(`checkout service running on ${env.port}`);
});
