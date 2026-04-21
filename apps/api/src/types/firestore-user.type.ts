import type { UserRole } from "@smart-campus/types";

export type FirestoreUser = {
  id: string;
  email: string;
  emailLowercase: string;
  role: UserRole;
  passwordHash: string;
  isEmailVerified: boolean;
  universityNumber: string | null;
  createdAt: string;
  updatedAt: string;
  verifiedAt: string | null;
};
