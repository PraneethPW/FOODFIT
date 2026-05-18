import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { aiRoutes } from "./routes/aiRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { profileRoutes } from "./routes/profileRoutes.js";
import { errorMiddleware, notFound } from "./middleware/errorMiddleware.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "FOODFIT API" });
});

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api/ai", aiRoutes);
app.use(notFound);
app.use(errorMiddleware);
