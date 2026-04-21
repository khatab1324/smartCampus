import type { VerifyOtpInput } from "@smart-campus/types";
import { createAppError } from "../../middleware/error.middleware.js";
import { findLatestActiveOtpByEmail, markOtpUsed } from "../../repositories/otp.repository.js";
import { findUserByEmail, markUserEmailVerified } from "../../repositories/user.repository.js";
import { getAccessTokenExpiresInSeconds, signAccessToken } from "../../services/jwt.service.js";
import { compareOtp } from "../../services/otp.service.js";
import { mapAuthUser } from "./map-auth-user.js";

export async function verifyEmailOtp(input: VerifyOtpInput) {
  const emailLowercase = input.email.trim().toLowerCase();
  const user = await findUserByEmail(emailLowercase);

  if (!user) {
    throw createAppError(400, "Invalid email or OTP");
  }

  if (user.isEmailVerified) {
    throw createAppError(409, "Email is already verified");
  }

  const otpRecord = await findLatestActiveOtpByEmail(emailLowercase, "verify-email");

  if (!otpRecord) {
    throw createAppError(400, "OTP is invalid or expired");
  }

  const matches = await compareOtp(input.otp, otpRecord.otpHash);

  if (!matches) {
    throw createAppError(400, "OTP is invalid or expired");
  }

  const verifiedAt = new Date().toISOString();

  await markOtpUsed(otpRecord.id, verifiedAt);

  const verifiedUser = await markUserEmailVerified(user.id, verifiedAt);

  if (!verifiedUser) {
    throw createAppError(500, "Failed to verify email");
  }

  const accessToken = signAccessToken({
    email: verifiedUser.email,
    role: verifiedUser.role,
    sub: verifiedUser.id,
    type: "access",
  });

  return {
    accessToken,
    expiresIn: getAccessTokenExpiresInSeconds(),
    user: mapAuthUser(verifiedUser),
  };
}
