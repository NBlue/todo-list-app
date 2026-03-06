import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { authApi } from '@/lib/api/auth';
import { queryKeys } from '@/lib/react-query';
import { useAuthStore } from '@/store/auth-store';
import type { LoginRequest, RegisterRequest } from '@/types/api';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const {
    updateTokens,
    updateUser,
    logout: logoutStore,
    isAuthenticated,
    user,
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      updateTokens(data);

      const userData = await authApi.getProfile();
      updateUser(userData);

      router.replace('/(tabs)');
    },
    onError: () => {
      // Error handled by caller
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      router.replace('/login' as never);
    },
    onError: () => {
      // Error handled by caller
    },
  });

  const profileQuery = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10,
  });

  const login = (data: LoginRequest) => loginMutation.mutate(data);
  const register = (data: RegisterRequest) => registerMutation.mutate(data);
  const logout = () => {
    logoutStore();
    queryClient.clear();
    router.replace('/login' as never);
  };

  return {
    login,
    register,
    logout,

    user,
    isAuthenticated,

    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,

    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    profileError: profileQuery.error,
  };
};
