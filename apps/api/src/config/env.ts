import dotenv from "dotenv";

export type AppEnv = {
  port: number;
  firebaseProjectId: string;
  firebaseClientEmail: string;
  firebasePrivateKey: string;
  jwtSecret?: string;
  jwtExpiresIn?: string;
  otpExpiresMinutes?: number;
  otpLength?: number;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
};

let cachedEnv: AppEnv | null = null;

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function requireNumberEnv(name: string) {
  const value = Number(requireEnv(name));

  if (Number.isNaN(value)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }

  return value;
}

function requireJwtExpiresInEnv(name: string) {
  const value = requireEnv(name);

  if (!/^(\d+)([smhd])$/.test(value)) {
    throw new Error(
      `Environment variable ${name} must use a supported duration like 15m, 1h, or 7d`,
    );
  }

  return value;
}

export function loadEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  dotenv.config();

  cachedEnv = {
    port: Number(process.env.PORT || 4000),
    firebaseProjectId: requireEnv("FIREBASE_PROJECT_ID"),
    firebaseClientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
    firebasePrivateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN
      ? requireJwtExpiresInEnv("JWT_EXPIRES_IN")
      : undefined,
    otpExpiresMinutes: process.env.OTP_EXPIRES_MINUTES
      ? requireNumberEnv("OTP_EXPIRES_MINUTES")
      : undefined,
    otpLength: process.env.OTP_LENGTH ? requireNumberEnv("OTP_LENGTH") : undefined,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? requireNumberEnv("SMTP_PORT") : undefined,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFromEmail: process.env.SMTP_FROM_EMAIL,
    smtpFromName: process.env.SMTP_FROM_NAME,
  };

  return cachedEnv;
}
