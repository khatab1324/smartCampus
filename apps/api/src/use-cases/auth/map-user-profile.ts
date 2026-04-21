import type { AuthUser } from "@smart-campus/types";
import type { FirestoreUserProfile } from "../../types/firestore-user-profile.type.js";

export function mapUserProfile(userProfile: FirestoreUserProfile): AuthUser {
  return {
    email: userProfile.email,
    id: userProfile.id,
    isEmailVerified: userProfile.isEmailVerified,
    role: userProfile.role,
    universityNumber: userProfile.universityNumber ?? undefined,
  };
}
