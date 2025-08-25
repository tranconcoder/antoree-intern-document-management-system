export { default as axiosInstance } from "./axios.service";
export { default as authService } from "./auth.service";

// Re-export types for convenience
export type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  Tokens,
  User,
  ApiResponse,
  ApiError,
  Document,
  UserSettings,
} from "@/types/api.types";
