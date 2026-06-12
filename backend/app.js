import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";
import { sanitizeRequestBody } from "./middleware/sanitize.js";
import { handleStripeWebhook } from "./controllers/stripe.controller.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  // Stripe webhook endpoint requires raw body for signature verification
  app.post(
    "/webhooks/stripe",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(sanitizeRequestBody);
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.get("/health", (req, res) => {
    res.json({ ok: true, service: "premium-car-care-api" });
  });

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
