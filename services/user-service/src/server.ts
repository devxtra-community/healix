import app from './app.ts';
import { connectDB, registerDBEvents } from './config/db.ts';
import { env } from './config/env.ts';

registerDBEvents();
connectDB();

app.listen(env.port, () => {
  console.log(`User Service running on ${env.port}`);
});
