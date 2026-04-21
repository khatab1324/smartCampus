import type { UserRole } from "@smart-campus/types";
import { getFirestore } from "../config/firebase.js";
import type { FirestoreUser } from "../types/firestore-user.type.js";

type CreateUserInput = {
  email: string;
  emailLowercase: string;
  passwordHash: string;
  role: UserRole;
  universityNumber?: string;
};

const collectionName = "users";

function mapUser(document: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot) {
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
    passwordHash: data.passwordHash,
    role: data.role,
    universityNumber: data.universityNumber ?? null,
    updatedAt: data.updatedAt,
    verifiedAt: data.verifiedAt ?? null,
  } satisfies FirestoreUser;
}

export async function findUserByEmail(emailLowercase: string) {
  const firestore = getFirestore();
  const snapshot = await firestore
    .collection(collectionName)
    .where("emailLowercase", "==", emailLowercase)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return mapUser(snapshot.docs[0]);
}

export async function findUserById(userId: string) {
  const firestore = getFirestore();
  const snapshot = await firestore.collection(collectionName).doc(userId).get();

  return mapUser(snapshot);
}

export async function createUser(input: CreateUserInput) {
  const firestore = getFirestore();
  const docRef = firestore.collection(collectionName).doc();
  const now = new Date().toISOString();

  const user: FirestoreUser = {
    createdAt: now,
    email: input.email,
    emailLowercase: input.emailLowercase,
    id: docRef.id,
    isEmailVerified: false,
    passwordHash: input.passwordHash,
    role: input.role,
    universityNumber: input.universityNumber ?? null,
    updatedAt: now,
    verifiedAt: null,
  };

  await docRef.set(user);

  return user;
}

export async function markUserEmailVerified(userId: string, verifiedAt: string) {
  const firestore = getFirestore();

  await firestore.collection(collectionName).doc(userId).update({
    isEmailVerified: true,
    updatedAt: verifiedAt,
    verifiedAt,
  });

  return findUserById(userId);
}
