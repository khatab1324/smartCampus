import type { UserRole } from "@smart-campus/types";
import { getFirestore } from "../config/firebase.js";
import type { FirestoreUserProfile } from "../types/firestore-user-profile.type.js";

type UpsertUserProfileRecordInput = {
  email: string;
  isEmailVerified: boolean;
  role: UserRole;
  universityNumber?: string;
  userId: string;
};

const collectionName = "users";

function mapUserProfile(
  document: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot,
) {
  const data = document.data();

  if (!data) {
    return null;
  }

  return {
    createdAt: data.createdAt,
    email: data.email,
    emailLowercase: data.emailLowercase,
    id: data.id,
    isEmailVerified: data.isEmailVerified,
    role: data.role,
    universityNumber: data.universityNumber ?? null,
    updatedAt: data.updatedAt,
    verifiedAt: data.verifiedAt ?? null,
  } satisfies FirestoreUserProfile;
}

export async function findUserProfileById(userId: string) {
  const firestore = getFirestore();
  const snapshot = await firestore.collection(collectionName).doc(userId).get();

  return mapUserProfile(snapshot);
}

export async function upsertUserProfileRecord(input: UpsertUserProfileRecordInput) {
  const firestore = getFirestore();
  const docRef = firestore.collection(collectionName).doc(input.userId);
  const existingProfile = await findUserProfileById(input.userId);
  const now = new Date().toISOString();

  const userProfile: FirestoreUserProfile = {
    createdAt: existingProfile?.createdAt ?? now,
    email: input.email,
    emailLowercase: input.email.trim().toLowerCase(),
    id: input.userId,
    isEmailVerified: input.isEmailVerified,
    role: input.role,
    universityNumber:
      input.role === "instructor" ? input.universityNumber?.trim() ?? null : null,
    updatedAt: now,
    verifiedAt:
      input.isEmailVerified ? existingProfile?.verifiedAt ?? now : existingProfile?.verifiedAt ?? null,
  };

  await docRef.set(userProfile);

  return userProfile;
}
