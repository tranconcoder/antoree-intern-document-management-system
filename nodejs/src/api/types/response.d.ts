import type { User } from "@/models/user.model";

export interface RegisterResponse {
  user: Omit<User, "user_password">;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginResponse extends RegisterResponse {}

export interface LeadResponse {
  lead: {
    id: string;
    lead_name: string;
    lead_email: string;
    lead_phone?: string;
    lead_company?: string;
    lead_message?: string;
    lead_status: string;
    lead_tags?: string[];
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface LeadsResponse {
  leads: LeadResponse["lead"][];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LeadStatsResponse {
  total: number;
  byStatus: Record<string, number>;
  byDate: {
    daily: Record<string, number>;
    monthly: Record<string, number>;
    yearly: Record<string, number>;
  };
}
