import { z } from "zod";

const passwordSchema = z.string().min(8);

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export const registerStudentSchema = z
  .object({
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine((value) => value.endsWith("@gmail.com"), {
        message: "Student registration requires a Gmail address",
      }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerInstructorSchema = z
  .object({
    email: z.string().email().toLowerCase(),
    universityNumber: z.string().trim().min(1),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyOtpSchema = z.object({
  email: z.string().email().toLowerCase(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const resendOtpSchema = z.object({
  email: z.string().email().toLowerCase(),
});

export const upsertUserProfileSchema = z
  .object({
    role: z.enum(["student", "instructor"]),
    universityNumber: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.role === "instructor" && !value.universityNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "University number is required for instructors",
        path: ["universityNumber"],
      });
    }
  });

export const createLectureSchema = z.object({
  title: z.string().min(3),
  startTime: z.string(),
  endTime: z.string(),
});

export const joinSessionSchema = z.object({
  lectureId: z.string(),
  studentId: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;
export type RegisterInstructorInput = z.infer<typeof registerInstructorSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type UpsertUserProfileInput = z.infer<typeof upsertUserProfileSchema>;
export type CreateLectureInput = z.infer<typeof createLectureSchema>;
export type JoinSessionInput = z.infer<typeof joinSessionSchema>;
