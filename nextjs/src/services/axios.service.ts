import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from "axios";
import { AXIOS_URL } from "@/configs/axios.config";
import { RefreshTokenResponse } from "@/types/response";

const axiosInstance = axios.create({
  baseURL: AXIOS_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
const performLogout = async (reason: string) => {
  if (typeof window !== "undefined") {
    console.log(`🚨 LOGOUT TRIGGERED: ${reason}`);
    console.trace("📍 Logout triggered from:");

    // Dynamic import to avoid circular dependency
    const { store } = await import("@/store");
    const { logoutUser } = await import("@/store/thunks/user.thunk");

    // Dispatch logout action to Redux store
    store.dispatch(logoutUser());

    // Small delay to ensure state is updated before redirect
    setTimeout(() => {
      console.log("🔄 Redirecting to login page...");
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
          console.log("🔍 Persist data keys:", Object.keys(persistData));

          const userData = JSON.parse(persistData.user || "{}");
          console.log("👤 User data structure:", {
            hasTokens: !!userData.tokens,
            hasAccessToken: !!userData.tokens?.accessToken,
            hasRefreshToken: !!userData.tokens?.refreshToken,
            tokenLength: userData.tokens?.accessToken?.length,
          });

          accessToken = userData.tokens?.accessToken || null;
        } catch (parseError) {
          console.error("Error parsing tokens from persist store:", parseError);
          accessToken = null;
        }
      }

      console.log(
        "🎫 Using access token:",
        accessToken ? accessToken.substring(0, 50) + "..." : "null"
      );

      if (accessToken) {
        const headers = toAxiosHeaders(config.headers);
        headers.set("Authorization", `Bearer ${accessToken}`);
        config.headers = headers;
        console.log("✅ Authorization header set");
      } else {
        console.log("❌ No access token available");
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
        await performLogout("No refresh token found");
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        // Already retried once, avoid loops
        await performLogout("Multiple refresh attempts failed");
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshClient
            .post<{ metadata: RefreshTokenResponse }>("/auth/refresh-token", {
              refreshToken,
            })
            .then((res) => {
              // Validate response structure
              if (
                !res.data?.metadata?.accessToken ||
                !res.data?.metadata?.refreshToken
              ) {
                throw new Error("Invalid refresh token response format");
              }
              return res.data.metadata;
            })
            .then(async (tokens) => {
              console.log("🔄 Token refreshed successfully:", {
                newAccessToken: tokens.accessToken.substring(0, 50) + "...",
                newRefreshToken: tokens.refreshToken.substring(0, 50) + "...",
              });

              if (typeof window !== "undefined") {
                // Dynamic import to avoid circular dependency
                const { store } = await import("@/store");
                const { updateTokens } = await import(
                  "@/store/slices/user.slice"
                );

                console.log("🔄 Updating Redux store with new tokens...");

                // Update tokens using Redux action
                store.dispatch(
                  updateTokens({
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                  })
                );

                // Force persist immediately
                const { persistor } = await import("@/store");
                await persistor.flush();

                console.log("✅ Tokens updated in Redux and persisted");

                // Verify tokens are actually stored
                setTimeout(() => {
                  const persistData = JSON.parse(
                    localStorage.getItem("persist:root") || "{}"
                  );
                  const userData = JSON.parse(persistData.user || "{}");
                  console.log("🔍 Verification - tokens after update:", {
                    hasAccessToken: !!userData.tokens?.accessToken,
                    accessTokenMatch:
                      userData.tokens?.accessToken === tokens.accessToken,
                  });
                }, 100);
              }
              return tokens;
            })
            .catch(async (refreshErr) => {
              console.error("Refresh token error:", refreshErr);
              // On refresh failure, perform logout
              await performLogout("Refresh token failed");
              throw refreshErr;
            })
            .finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
        }

        // Wait for refresh to resolve and then retry the original request
        const tokens = await (refreshPromise as Promise<RefreshTokenResponse>);

        console.log("🔄 Retrying original request with new token...");

        // Add a small delay to ensure tokens are persisted
        await new Promise((resolve) => setTimeout(resolve, 200));

        const headers = toAxiosHeaders(originalRequest.headers);
        headers.set("Authorization", `Bearer ${tokens.accessToken}`);
        originalRequest.headers = headers;

        console.log("🔄 Original request headers updated with new token");

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
