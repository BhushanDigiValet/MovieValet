import { UserRole } from "./defaultValue";

// types/user.ts
export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface UserFilterInput {
  role?: UserRole;
}
