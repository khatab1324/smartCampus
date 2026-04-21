import type { NextFunction, Response } from "express";
import { getAuth } from "../config/firebase.js";
import { findUserProfileById } from "../repositories/user-profile.repository.js";
import type { AuthRequest } from "../types/auth-request.type.js";
import { createAppError } from "./error.middleware.js";

export async function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw createAppError(401, "Authorization header is required");
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw createAppError(401, "Authorization header must be Bearer token");
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const userProfile = await findUserProfileById(decodedToken.uid);

    if (!decodedToken.email) {
      throw createAppError(401, "Email is required in the Firebase token");
    }

    req.auth = {
      email: decodedToken.email,
      isEmailVerified: Boolean(decodedToken.email_verified),
      role: userProfile?.role,
      userId: decodedToken.uid,
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      const isFirebaseAuthError =
        error.name === "FirebaseAuthError" ||
        error.name === "AuthClientErrorCode" ||
        error.message.toLowerCase().includes("token");

      if (isFirebaseAuthError) {
        return next(createAppError(401, "Invalid or expired Firebase token"));
      }
    }

    return next(error);
  }
}
