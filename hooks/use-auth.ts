import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { authApi } from '@/lib/api/auth';
import { notificationApi } from '@/lib/api/notification';
import { queryKeys } from '@/lib/react-query';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';
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
  const { fcmToken, setFcmToken } = useNotificationStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      updateTokens(data);

      const userData = await authApi.getProfile();
      updateUser(userData);

      router.replace('/(tabs)');
    },
    onError: (error) => {
      console.error('ERR: ', error);
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
    (async () => {
      // Unregister device token on backend before clearing auth
      if (fcmToken) {
        try {
          await notificationApi.unregisterDevice(fcmToken);
        } catch {
          // Ignore unregister failures to avoid blocking logout UX
        }
      }

      setFcmToken(null);
      logoutStore();
      queryClient.clear();
      router.replace('/login' as never);
    })();
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
