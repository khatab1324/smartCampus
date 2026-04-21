import type { RegisterStudentInput } from "@smart-campus/types";
import { getAuthConfig } from "../../config/auth.js";
import { createAppError } from "../../middleware/error.middleware.js";
import { createOtp } from "../../repositories/otp.repository.js";
import { createUser, findUserByEmail } from "../../repositories/user.repository.js";
import { sendVerificationOtpEmail } from "../../services/email.service.js";
import { buildOtpExpiry, generateOtp, hashOtp } from "../../services/otp.service.js";
import { hashPassword } from "../../services/password.service.js";
import { mapAuthUser } from "./map-auth-user.js";

export async function registerStudent(input: RegisterStudentInput) {
  const email = input.email.trim();
  const emailLowercase = email.toLowerCase();
  const existingUser = await findUserByEmail(emailLowercase);

  if (existingUser) {
    throw createAppError(409, "Email is already registered");
  }

  const { otpExpiresMinutes, otpLength } = getAuthConfig();
  const passwordHash = await hashPassword(input.password);
  const user = await createUser({
    email,
    emailLowercase,
    passwordHash,
    role: "student",
  });
  const otp = generateOtp(otpLength);
  const otpHash = await hashOtp(otp);

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

  return mapAuthUser(user);
}
