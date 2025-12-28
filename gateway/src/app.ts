import express from "express"
import user from "./routes/user.route.ts"
import profileRoute from "./routes/profile.route.ts"
import product from "./routes/product.route.ts"
import checkout from "./routes/product.route.ts"
import { morganMiddleware } from "./config/morgan.ts"
import { errorHandler } from "./middleware/errorHandler.ts"
import apiV1 from "./routes/index.ts"
import { globalRateLimiter } from "./middleware/rateLimit.middleware.ts"
const app=express()
app.use(morganMiddleware);
app.use(globalRateLimiter)

app.get("/health", (_req, res) => {
  res.json({
    service: "api-gateway",
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
app.use('/api/v1',apiV1)
// app.use('/api/v1/auth',user)

// app.use('/api/v1/profile',profileRoute)

// app.use('/api/v1/catalog',product)
// app.use('/api/v1/checkout',checkout)
// app.post("/api/v1/auth/login", (_req, res) => {
//   res.json({ message: "APP LEVEL LOGIN HIT" });
// });
app.use(errorHandler);

export default app

