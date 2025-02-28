import { UserRole } from "./defaultValue";

// types/user.ts
export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  cityName?: string;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  cityId?: string;
  isDeleted?:boolean;
}

export interface UserFilterInput {
  role?: UserRole;
  limit?: number;
  offset?: number;
}
