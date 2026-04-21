import type { OtpPurpose, FirestoreOtp } from "../types/firestore-otp.type.js";
import { getFirestore } from "../config/firebase.js";

type CreateOtpInput = {
  emailLowercase: string;
  userId: string;
  purpose: OtpPurpose;
  otpHash: string;
  expiresAt: string;
};

const collectionName = "emailOtps";

function mapOtp(document: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot) {
  const data = document.data();

  if (!data) {
    return null;
  }

  return {
    createdAt: data.createdAt,
    emailLowercase: data.emailLowercase,
    expiresAt: data.expiresAt,
    id: data.id,
    invalidatedAt: data.invalidatedAt ?? null,
    otpHash: data.otpHash,
    purpose: data.purpose,
    usedAt: data.usedAt ?? null,
    userId: data.userId,
  } satisfies FirestoreOtp;
}

export async function createOtp(input: CreateOtpInput) {
  const firestore = getFirestore();
  const docRef = firestore.collection(collectionName).doc();
  const now = new Date().toISOString();

  const otp: FirestoreOtp = {
    createdAt: now,
    emailLowercase: input.emailLowercase,
    expiresAt: input.expiresAt,
    id: docRef.id,
    invalidatedAt: null,
    otpHash: input.otpHash,
    purpose: input.purpose,
    usedAt: null,
    userId: input.userId,
  };

  await docRef.set(otp);

  return otp;
}

export async function findLatestActiveOtpByEmail(
  emailLowercase: string,
  purpose: OtpPurpose,
) {
  const firestore = getFirestore();
  const snapshot = await firestore
    .collection(collectionName)
    .where("emailLowercase", "==", emailLowercase)
    .where("purpose", "==", purpose)
    .get();

  const now = Date.now();
  const activeOtps = snapshot.docs
    .map(mapOtp)
    .filter(
      (otp): otp is FirestoreOtp =>
        otp !== null &&
        otp.invalidatedAt === null &&
        otp.usedAt === null &&
        new Date(otp.expiresAt).getTime() > now,
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return activeOtps[0] ?? null;
}

export async function markOtpUsed(otpId: string, usedAt: string) {
  const firestore = getFirestore();

  await firestore.collection(collectionName).doc(otpId).update({
    usedAt,
  });
}

export async function invalidateActiveOtps(
  emailLowercase: string,
  purpose: OtpPurpose,
  invalidatedAt: string,
) {
  const firestore = getFirestore();
  const snapshot = await firestore
    .collection(collectionName)
    .where("emailLowercase", "==", emailLowercase)
    .where("purpose", "==", purpose)
    .get();

  const batch = firestore.batch();

  snapshot.docs
    .map(mapOtp)
    .filter(
      (otp): otp is FirestoreOtp =>
        otp !== null && otp.invalidatedAt === null && otp.usedAt === null,
    )
    .forEach((otp) => {
      batch.update(firestore.collection(collectionName).doc(otp.id), {
        invalidatedAt,
      });
    });

  await batch.commit();
}
