import axiosInstance from "./axios.service";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  Tokens,
  User,
  ApiResponse,
} from "@/types/api.types";

interface RefreshTokenResponse {
  tokens: Tokens;
}

// Auth service
export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  // Register
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post("/auth/register", credentials);
    return response.data;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await axiosInstance.post("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      // Call logout endpoint nếu backend có
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      // Ignore errors khi logout
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear local storage
      this.clearLocalStorage();
    }
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await axiosInstance.get("/auth/profile");
    return response.data.user || response.data;
  },

  // Update profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await axiosInstance.put("/auth/profile", profileData);
    return response.data.user || response.data;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    try {
      const tokens = localStorage.getItem("tokens");
      if (!tokens) return false;

      const parsed = JSON.parse(tokens);
      return !!(parsed?.accessToken && parsed?.refreshToken);
    } catch {
      return false;
    }
  },

  // Get stored tokens
  getStoredTokens() {
    try {
      const tokens = localStorage.getItem("tokens");
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  },

  // Clear local storage
  clearLocalStorage(): void {
    try {
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

export default authService;
