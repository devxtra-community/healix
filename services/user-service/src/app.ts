import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./api/routes/auth.routes.ts";
import profileRoutes from "./api/routes/profile.routes.ts";
import { globalErrorHandler } from "./api/middlewares/error.middleware.ts";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.get("/health", (_req, res) => {
  res.json({
    service: "api-gateway",
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);

app.use(globalErrorHandler);

export default app;
