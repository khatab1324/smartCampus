import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { healthRouter } from "./routes/health.routes.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(authRouter);
  app.use(healthRouter);
  app.use(errorMiddleware);

  return app;
}
