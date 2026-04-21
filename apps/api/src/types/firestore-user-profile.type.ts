import type { UserRole } from "@smart-campus/types";

export type FirestoreUserProfile = {
  createdAt: string;
  email: string;
  emailLowercase: string;
  id: string;
  isEmailVerified: boolean;
  role: UserRole;
  universityNumber: string | null;
  updatedAt: string;
  verifiedAt: string | null;
};
