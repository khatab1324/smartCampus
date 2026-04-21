import type { ResendOtpInput } from "@smart-campus/types";
import { getAuthConfig } from "../../config/auth.js";
import { createOtp, invalidateActiveOtps } from "../../repositories/otp.repository.js";
import { findUserByEmail } from "../../repositories/user.repository.js";
import { sendVerificationOtpEmail } from "../../services/email.service.js";
import { buildOtpExpiry, generateOtp, hashOtp } from "../../services/otp.service.js";

export async function resendEmailOtp(input: ResendOtpInput) {
  const emailLowercase = input.email.trim().toLowerCase();
  const user = await findUserByEmail(emailLowercase);

  if (!user || user.isEmailVerified) {
    return;
  }

  const { otpExpiresMinutes, otpLength } = getAuthConfig();
  const now = new Date().toISOString();
  const otp = generateOtp(otpLength);
  const otpHash = await hashOtp(otp);

  await invalidateActiveOtps(emailLowercase, "verify-email", now);

  await createOtp({
    emailLowercase,
    expiresAt: buildOtpExpiry(new Date(), otpExpiresMinutes),
    otpHash,
    purpose: "verify-email",
    userId: user.id,
  });

  await sendVerificationOtpEmail({
    email: user.email,
    expiresInMinutes: otpExpiresMinutes,
    otp,
    role: user.role,
  });
}
