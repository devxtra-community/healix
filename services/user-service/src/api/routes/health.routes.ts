import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/db", (_req, res) => {
  const state = mongoose.connection.readyState;

  /*
    0 = disconnected
    1 = connected
    2 = connecting
    3 = disconnecting
  */

  if (state === 1) {
    return res.status(200).json({
      status: "UP",
      database: "connected",
    });
  }

  return res.status(503).json({
    status: "DOWN",
    database: "not connected",
    state,
  });
});

router.get("/", (_req, res) => {
  res.json({
    service: "user-service",
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
