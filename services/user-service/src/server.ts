import app from './app.js';
import { connectDB, registerDBEvents } from './config/db.js';
import { env } from './config/env.js';

registerDBEvents();
connectDB();

app.listen(env.port, () => {
  console.log(`User Service running on ${env.port}`);
});
