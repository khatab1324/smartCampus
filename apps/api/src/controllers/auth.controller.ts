import type { UpsertUserProfileInput } from "@smart-campus/types";
import type { NextFunction, Response } from "express";
import { createAppError } from "../middleware/error.middleware.js";
import type { AuthRequest } from "../types/auth-request.type.js";
import { getCurrentUserProfile } from "../use-cases/auth/get-current-user-profile.use-case.js";
import { upsertUserProfile } from "../use-cases/auth/upsert-user-profile.use-case.js";

export async function getCurrentUserController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.auth) {
      throw createAppError(401, "Unauthorized");
    }

    const user = await getCurrentUserProfile(req.auth.userId);

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function upsertCurrentUserController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.auth) {
      throw createAppError(401, "Unauthorized");
    }

    const user = await upsertUserProfile({
      ...(req.body as UpsertUserProfileInput),
      email: req.auth.email,
      isEmailVerified: req.auth.isEmailVerified,
      userId: req.auth.userId,
    });

    res.status(200).json({
      data: user,
      message: "User profile synced successfully.",
    });
  } catch (error) {
    next(error);
  }
}
