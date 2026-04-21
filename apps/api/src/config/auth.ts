import type { SignOptions } from "jsonwebtoken";
import { loadEnv } from "./env.js";

export function getAuthConfig() {
  const env = loadEnv();

  if (
    !env.jwtSecret ||
    !env.jwtExpiresIn ||
    !env.otpExpiresMinutes ||
    !env.otpLength
  ) {
    throw new Error(
      "JWT/OTP auth is not configured. Set JWT_SECRET, JWT_EXPIRES_IN, OTP_EXPIRES_MINUTES, and OTP_LENGTH to use it.",
    );
  }

  return {
    jwtExpiresIn: env.jwtExpiresIn as NonNullable<SignOptions["expiresIn"]>,
    jwtSecret: env.jwtSecret,
    otpExpiresMinutes: env.otpExpiresMinutes,
    otpLength: env.otpLength,
  };
}
