import mongoose from "mongoose";
import { env } from "./env.ts";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Initial MongoDB connection failed:", error);
  }
};

export const registerDBEvents = () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connection established");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Retrying...");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err);
  });
};
