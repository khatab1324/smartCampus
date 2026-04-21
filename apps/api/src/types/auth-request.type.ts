import type { Request } from "express";
import type { UserRole } from "@smart-campus/types";

export type AuthRequest = Request & {
  auth?: {
    email: string;
    isEmailVerified: boolean;
    role?: UserRole;
    userId: string;
  };
};
