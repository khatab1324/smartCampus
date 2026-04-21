import type { UpsertUserProfileInput } from "@smart-campus/types";
import { upsertUserProfileRecord } from "../../repositories/user-profile.repository.js";
import { mapUserProfile } from "./map-user-profile.js";

type UpsertUserProfileUseCaseInput = UpsertUserProfileInput & {
  email: string;
  isEmailVerified: boolean;
  userId: string;
};

export async function upsertUserProfile(input: UpsertUserProfileUseCaseInput) {
  const userProfile = await upsertUserProfileRecord({
    email: input.email,
    isEmailVerified: input.isEmailVerified,
    role: input.role,
    universityNumber: input.universityNumber,
    userId: input.userId,
  });

  return mapUserProfile(userProfile);
}
