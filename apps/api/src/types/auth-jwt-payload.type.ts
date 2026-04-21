import type { UserRole } from "@smart-campus/types";

export type AuthJwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  type: "access";
};
