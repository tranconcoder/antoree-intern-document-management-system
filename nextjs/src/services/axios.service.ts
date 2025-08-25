import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AXIOS_URL } from "@/configs/axios.config";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: AXIOS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag để tránh multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

// Function để xử lý failed queue
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Function để lấy tokens từ localStorage
const getTokensFromStorage = () => {
  try {
    const tokens = localStorage.getItem("tokens");
    return tokens ? JSON.parse(tokens) : null;
  } catch {
    return null;
  }
};

// Function để lưu tokens vào localStorage
const saveTokensToStorage = (tokens: any) => {
  try {
    localStorage.setItem("tokens", JSON.stringify(tokens));
  } catch (error) {
    console.error("Error saving tokens to localStorage:", error);
  }
};

// Function để xóa tokens khỏi localStorage
const clearTokensFromStorage = () => {
  try {
    localStorage.removeItem("tokens");
  } catch (error) {
    console.error("Error clearing tokens from localStorage:", error);
  }
};

// Function để refresh access token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const tokens = getTokensFromStorage();
    if (!tokens?.refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${AXIOS_URL}/auth/refresh`, {
      refreshToken: tokens.refreshToken,
    });

    const newTokens = response.data.tokens;
    saveTokensToStorage(newTokens);

    return newTokens.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    clearTokensFromStorage();

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }

    return null;
  }
};

// Request interceptor để đính kèm access token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getTokensFromStorage();

    if (tokens?.accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý refresh token
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu là lỗi 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu đang trong quá trình refresh, thêm request vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          // Update header cho original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Process queue với new token
          processQueue(null, newAccessToken);

          // Retry original request
          return axiosInstance(originalRequest);
        } else {
          // Refresh failed, process queue với error
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed, process queue với error
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
