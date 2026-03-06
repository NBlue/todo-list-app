import apiClient from './axios';
import type {
  LoginRequest,
  RegisterRequest,
  User,
  AuthTokens,
  ApiResponse,
} from '@/types/api';

export const authApi = {
  // Login
  login: async (data: LoginRequest): Promise<AuthTokens> => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>(
      '/auth/sign-in',
      data
    );
    return response.data.data;
  },

  // Register - returns User, not tokens (user must login after)
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(
      '/auth/sign-up',
      data
    );
    return response.data.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>(
      '/auth/refresh-token',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    return response.data.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/user');
    return response.data.data;
  },
};
