import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./api/routes/auth.routes.ts";

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

//routes
app.use("/api/v1/auth", authRoutes);

export default app;
