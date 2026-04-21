import type { AuthUser } from "@smart-campus/types";
import type { FirestoreUser } from "../../types/firestore-user.type.js";

export function mapAuthUser(user: FirestoreUser): AuthUser {
  return {
    email: user.email,
    id: user.id,
    isEmailVerified: user.isEmailVerified,
    role: user.role,
    universityNumber: user.universityNumber ?? undefined,
  };
}
