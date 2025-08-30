import { userModel } from "@/models/user.model";
import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from "axios";
import { AXIOS_URL } from "@/configs/axios.config";
import { RefreshTokenResponse } from "@/types/response";
import { store } from "@/store";
import { logoutUser } from "@/store/thunks/user.thunk";
import { updateTokens } from "@/store/slices/user.slice";

const axiosInstance = axios.create({
  baseURL: AXIOS_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // For HTTPS development, ignore self-signed certificate errors
  ...(typeof window === "undefined" &&
    process.env.NODE_ENV === "development" && {
      httpsAgent: new (require("https").Agent)({
        rejectUnauthorized: false,
      }),
    }),
});

// Separate instance for token refresh to avoid interceptor recursion
const refreshClient = axios.create({
  baseURL: AXIOS_URL,
  headers: { "Content-Type": "application/json" },
  // For HTTPS development, ignore self-signed certificate errors
  ...(typeof window === "undefined" &&
    process.env.NODE_ENV === "development" && {
      httpsAgent: new (require("https").Agent)({
        rejectUnauthorized: false,
      }),
    }),
});

// Normalize headers to AxiosHeaders without unsafe casts
const toAxiosHeaders = (headers: unknown): AxiosHeaders => {
  if (headers instanceof AxiosHeaders) return headers;
  const ax = new AxiosHeaders();
  if (headers && typeof headers === "object") {
    for (const [k, v] of Object.entries(headers as Record<string, unknown>)) {
      ax.set(k, v as string);
    }
  }
  return ax;
};

// Concurrency control for refresh flow
let isRefreshing = false;
let refreshPromise: Promise<RefreshTokenResponse> | null = null;

// Helper function to perform complete logout using Redux
const performLogout = (reason: string) => {
  if (typeof window !== "undefined") {
    console.log(`${reason}, logging out...`);

    // Dispatch logout action to Redux store
    store.dispatch(logoutUser());

    // Small delay to ensure state is updated before redirect
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 100);
  }
};

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      let accessToken = null;
      if (typeof window !== "undefined") {
        try {
          const persistData = JSON.parse(
            localStorage.getItem("persist:root") || "{}"
          );
          const userData = JSON.parse(persistData.user || "{}");
          accessToken = userData.tokens?.accessToken || null;
        } catch (parseError) {
          console.error("Error parsing tokens from persist store:", parseError);
          accessToken = null;
        }
      }

      console.log({ accessToken });

      if (accessToken) {
        const headers = toAxiosHeaders(config.headers);
        headers.set("Authorization", `Bearer ${accessToken}`);
        config.headers = headers;
      }
    } catch (e: any) {
      console.error("Error in request interceptor:", e);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = (error.config || {}) as RetriableConfig;

    // Do not attempt to refresh for the refresh endpoint itself
    const isRefreshCall = (originalRequest?.url || "").includes(
      "/auth/refresh-token"
    );

    if (status === 401 && !isRefreshCall) {
      let refreshToken = null;
      if (typeof window !== "undefined") {
        try {
          const persistData = JSON.parse(
            localStorage.getItem("persist:root") || "{}"
          );
          const userData = JSON.parse(persistData.user || "{}");
          refreshToken = userData.tokens?.refreshToken || null;
        } catch (parseError) {
          console.error(
            "Error parsing refresh token from persist store:",
            parseError
          );
          refreshToken = null;
        }
      }

      if (!refreshToken) {
        // No refresh token -> perform logout
        performLogout("No refresh token found");
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        // Already retried once, avoid loops
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshClient
            .post<RefreshTokenResponse>("/auth/refresh-token", {
              refreshToken,
            })
            .then((res) => res.data)
            .then((tokens) => {
              if (typeof window !== "undefined") {
                // Update tokens using Redux action
                store.dispatch(
                  updateTokens({
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                  })
                );
              }
              return tokens;
            })
            .catch((refreshErr) => {
              // On refresh failure, perform logout
              performLogout("Refresh token failed");
              throw refreshErr;
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        // Wait for refresh to resolve and then retry the original request
        const tokens = await (refreshPromise as Promise<RefreshTokenResponse>);

        const headers = toAxiosHeaders(originalRequest.headers);
        headers.set("Authorization", `Bearer ${tokens.accessToken}`);
        originalRequest.headers = headers;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
