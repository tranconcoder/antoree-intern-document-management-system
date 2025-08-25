// Auth related types
export interface User {
  _id: string;
  user_email: string;
  user_firstName: string;
  user_lastName: string;
  user_gender: boolean;
  user_dayOfBirth: Date;
  createdAt: string;
  updatedAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface LoginCredentials {
  user_email: string;
  user_password: string;
}

export interface RegisterCredentials {
  user_email: string;
  user_password: string;
  user_firstName: string;
  user_lastName: string;
  user_gender: boolean;
  user_dayOfBirth: number; // Unix timestamp in seconds
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

// Document related types (for future use)
export interface Document {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// Settings related types (for future use)
export interface UserSettings {
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
}
