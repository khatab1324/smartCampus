import { createAppError } from "../../middleware/error.middleware.js";
import { findUserProfileById } from "../../repositories/user-profile.repository.js";
import { mapUserProfile } from "./map-user-profile.js";

export async function getCurrentUserProfile(userId: string) {
  const userProfile = await findUserProfileById(userId);

  if (!userProfile) {
    throw createAppError(404, "User profile not found");
  }

  return mapUserProfile(userProfile);
}
