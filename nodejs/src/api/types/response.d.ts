import type { User } from "@/models/user.model";

export interface RegisterResponse {
  user: Omit<User, "user_password">;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginResponse extends RegisterResponse {}
