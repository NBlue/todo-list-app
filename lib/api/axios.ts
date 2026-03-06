import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

import { API_URL } from '@/constants/config';
import { useAuthStore } from '@/store/auth-store';
import type { ApiError } from '@/types/api';

interface ErrorResponse {
  message?: string;
  error?: string;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token expired
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { refreshToken, updateTokens, logout } = useAuthStore.getState();

        if (!refreshToken) {
          logout();
          throw error;
        }

        // Try to refresh token - backend expects Bearer refreshToken in header
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newTokens = refreshResponse.data.data;
        updateTokens(newTokens);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();

        // Redirect to login - handled by auth guard
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorData = error.response?.data as ErrorResponse;
    const apiError: ApiError = {
      message: errorData?.message || error.message || 'An error occurred',
      statusCode: error.response?.status || 500,
      error: errorData?.error,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;

// Helper function to handle API errors
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message:
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        'An error occurred',
      statusCode: error.response?.status || 500,
      error: (error.response?.data as { error?: string })?.error,
    };
  }

  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
  };
};
