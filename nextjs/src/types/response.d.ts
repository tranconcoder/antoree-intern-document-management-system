import { User } from "./user";

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: RefreshTokenResponse;
}
