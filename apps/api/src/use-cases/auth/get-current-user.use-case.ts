import { createAppError } from "../../middleware/error.middleware.js";
import { findUserById } from "../../repositories/user.repository.js";
import { mapAuthUser } from "./map-auth-user.js";

export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw createAppError(401, "Unauthorized");
  }

  return mapAuthUser(user);
}
