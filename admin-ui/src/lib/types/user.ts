export type Role = "STUDENT" | "LECTURER" | "ADMIN";

export interface Me {
  id: number;
  email: string;
  role: Role;
  fullName?: string;
  studentId?: string;
  faculty?: string;
  major?: string;
}
