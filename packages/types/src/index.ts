export type UserRole = "student" | "instructor";

export type AttendanceStatus = "present" | "late" | "absent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified?: boolean;
  universityNumber?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  universityNumber?: string;
}

export interface UpsertUserProfileInput {
  role: UserRole;
  universityNumber?: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface RegisterStudentInput {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterInstructorInput {
  email: string;
  universityNumber: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface ResendOtpInput {
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface Lecture {
  id: string;
  title: string;
  doctorId: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  lectureId: string;
  status: AttendanceStatus;
  timestamp: string;
}
