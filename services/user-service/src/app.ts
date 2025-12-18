import express from "express";
import authRoutes from "./api/routes/auth.routes.ts";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//routes
app.use("/api/v1/auth", authRoutes);

export default app;
