import type { LoginInput } from "@smart-campus/types";
import { createAppError } from "../../middleware/error.middleware.js";
import { findUserByEmail } from "../../repositories/user.repository.js";
import { getAccessTokenExpiresInSeconds, signAccessToken } from "../../services/jwt.service.js";
import { comparePassword } from "../../services/password.service.js";
import { mapAuthUser } from "./map-auth-user.js";

export async function login(input: LoginInput) {
  const emailLowercase = input.email.trim().toLowerCase();
  const user = await findUserByEmail(emailLowercase);

  if (!user) {
    throw createAppError(401, "Invalid email or password");
  }

  const passwordMatches = await comparePassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw createAppError(401, "Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw createAppError(403, "Email verification required");
  }

  const accessToken = signAccessToken({
    email: user.email,
    role: user.role,
    sub: user.id,
    type: "access",
  });

  return {
    accessToken,
    expiresIn: getAccessTokenExpiresInSeconds(),
    user: mapAuthUser(user),
  };
}
