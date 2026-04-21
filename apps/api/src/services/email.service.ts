import nodemailer from "nodemailer";
import { loadEnv } from "../config/env.js";

type SendVerificationOtpEmailInput = {
  email: string;
  expiresInMinutes: number;
  otp: string;
  role: "student" | "instructor";
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const env = loadEnv();

  if (
    !env.smtpHost ||
    !env.smtpPort ||
    !env.smtpUser ||
    !env.smtpPass
  ) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS to send OTP emails.",
    );
  }

  transporter = nodemailer.createTransport({
    auth: {
      pass: env.smtpPass,
      user: env.smtpUser,
    },
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
  });

  return transporter;
}

export async function sendVerificationOtpEmail({
  email,
  expiresInMinutes,
  otp,
  role,
}: SendVerificationOtpEmailInput) {
  const env = loadEnv();

  if (!env.smtpFromEmail || !env.smtpFromName) {
    throw new Error(
      "SMTP sender is not configured. Set SMTP_FROM_EMAIL and SMTP_FROM_NAME to send OTP emails.",
    );
  }

  const transport = getTransporter();

  await transport.sendMail({
    from: `"${env.smtpFromName}" <${env.smtpFromEmail}>`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #181c23;">
        <h2 style="margin-bottom: 8px;">Verify your Smart Campus account</h2>
        <p style="margin-top: 0;">You are registering as a ${role}. Use the OTP below to verify your email address.</p>
        <div style="margin: 24px 0; padding: 16px 20px; background: #f1f3fe; border-radius: 16px; font-size: 32px; font-weight: 800; letter-spacing: 10px; color: #0058bc;">
          ${otp}
        </div>
        <p>This OTP expires in ${expiresInMinutes} minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
    subject: "Verify your Smart Campus account",
    text: `Verify your Smart Campus account with this OTP: ${otp}. It expires in ${expiresInMinutes} minutes.`,
    to: email,
  });
}
