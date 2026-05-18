import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  CLIENT_URLS: z.string().default("http://localhost:5173,https://foodfit-six.vercel.app"),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(20),
  JWT_REFRESH_SECRET: z.string().min(20),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  OPENROUTER_API_KEY: z.string().min(1),
  OPENROUTER_REFERER_URL: z.string().url().default("https://foodfit-six.vercel.app"),
  OPENROUTER_MODEL: z.string().default("openai/gpt-4o-mini")
});

export const env = envSchema.parse(process.env);
