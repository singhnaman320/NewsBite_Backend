import cors from "cors";
import express from "express";
import morgan from "morgan";

import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import adminRoutes from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import feedRoutes from "./routes/feedRoutes";
import trackingRoutes from "./routes/trackingRoutes";
import userRoutes from "./routes/userRoutes";

export const app = express();

app.use(
  cors({
    origin: env.clientUrl
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tracking", trackingRoutes);

app.use(errorHandler);
