import type { NextFunction, Request, Response } from "express";
import { createAppError } from "./error.middleware.js";

type ParseableSchema<T> = {
  parse(data: unknown): T;
};

type ZodLikeIssue = {
  message?: string;
  path?: Array<string | number>;
};

type ZodLikeError = {
  issues?: ZodLikeIssue[];
  name?: string;
};

function isZodLikeError(value: unknown): value is ZodLikeError {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    value.name === "ZodError" &&
    "issues" in value
  );
}

export function validateBody<T>(schema: ParseableSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (isZodLikeError(error)) {
        const message =
          error.issues?.[0]?.message || "Request validation failed";

        return next(createAppError(400, message));
      }

      return next(error);
    }
  };
}
