export type OtpPurpose = "verify-email";

export type FirestoreOtp = {
  id: string;
  emailLowercase: string;
  userId: string;
  purpose: OtpPurpose;
  otpHash: string;
  expiresAt: string;
  createdAt: string;
  usedAt: string | null;
  invalidatedAt: string | null;
};
