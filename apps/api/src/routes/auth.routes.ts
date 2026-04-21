import { Router } from "express";
import { upsertUserProfileSchema } from "@smart-campus/validation";
import {
  getCurrentUserController,
  upsertCurrentUserController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";

export const authRouter = Router();

authRouter.get("/auth/me", authMiddleware, getCurrentUserController);
authRouter.put(
  "/auth/profile",
  authMiddleware,
  validateBody(upsertUserProfileSchema),
  upsertCurrentUserController,
);
