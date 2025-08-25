import type { User } from "@/models/user.model";

export interface RegisterResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginResponse extends RegisterResponse {}
