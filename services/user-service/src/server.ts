import app from "./app.ts";
import { connectDB } from "./config/db.ts";
import { env } from "./config/env.ts";


connectDB()
app.listen(env.port, () => {
  console.log(`User Service running on ${env.port}`);
});
