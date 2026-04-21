import jwt from "jsonwebtoken";
import type { AuthJwtPayload } from "../types/auth-jwt-payload.type.js";
import { getAuthConfig } from "../config/auth.js";

export function signAccessToken(payload: AuthJwtPayload) {
  const { jwtExpiresIn, jwtSecret } = getAuthConfig();

  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
}

export function verifyAccessToken(token: string) {
  const { jwtSecret } = getAuthConfig();
  const payload = jwt.verify(token, jwtSecret);

  if (typeof payload !== "object" || payload === null) {
    throw new Error("Invalid JWT payload");
  }

  if (
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    (payload.role !== "student" && payload.role !== "instructor") ||
    payload.type !== "access"
  ) {
    throw new Error("Invalid JWT payload");
  }

  return {
    email: payload.email,
    role: payload.role,
    sub: payload.sub,
    type: payload.type,
  } satisfies AuthJwtPayload;
}

export function getAccessTokenExpiresInSeconds() {
  const { jwtExpiresIn } = getAuthConfig();

  if (typeof jwtExpiresIn === "number") {
    return jwtExpiresIn;
  }

  const match = /^(\d+)([smhd])$/.exec(jwtExpiresIn);

  if (!match) {
    return 0;
  }

  const [, rawValue, unit] = match;
  const value = Number(rawValue);

  if (unit === "s") return value;
  if (unit === "m") return value * 60;
  if (unit === "h") return value * 3600;
  return value * 86400;
}
