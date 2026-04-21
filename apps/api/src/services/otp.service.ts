import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export function generateOtp(length: number) {
  const buffer = randomBytes(length);
  let value = "";

  for (const byte of buffer) {
    value += String(byte % 10);
  }

  return value.slice(0, length);
}

export function buildOtpExpiry(now: Date, minutes: number) {
  return new Date(now.getTime() + minutes * 60_000).toISOString();
}

export async function hashOtp(otp: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(otp, salt, 64)) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function compareOtp(otp: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derivedKey = (await scrypt(otp, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(hash, "hex");

  if (storedBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derivedKey);
}
