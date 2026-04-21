import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

async function hashValue(value: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(value, salt, 64)) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
}

async function compareValue(value: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derivedKey = (await scrypt(value, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(hash, "hex");

  if (storedBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derivedKey);
}

export async function hashPassword(password: string) {
  return hashValue(password);
}

export async function comparePassword(password: string, passwordHash: string) {
  return compareValue(password, passwordHash);
}
