import { useEffect, useState } from 'react';
import { router, usePathname } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';

const ROUTE_CONFIG = {
  public: ['/(auth)/login', '/(auth)/register'],
  authOnly: ['/(auth)/login', '/(auth)/register'],
};

export function useAuthGuard() {
  const pathname = usePathname();
  const { isAuthenticated, user, accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  const hasValidAuth = isAuthenticated && accessToken && user;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const checkAuthAndRedirect = () => {
      const isAuthRoute =
        pathname?.includes('login') || pathname?.includes('register');
      const isProtectedRoute =
        pathname?.includes('(tabs)') || pathname === '/' || pathname === '';

      if (hasValidAuth && isAuthRoute) {
        router.replace('/(tabs)');
        return;
      }

      if (!hasValidAuth && isProtectedRoute) {
        router.replace('/login' as never);
        return;
      }

      setIsLoading(false);
    };

    const timer = setTimeout(checkAuthAndRedirect, 150);

    return () => clearTimeout(timer);
  }, [hasValidAuth, pathname, isHydrated]);

  return {
    isLoading,
    isAuthenticated: hasValidAuth,
    user,
    shouldShowContent: !isLoading,
  };
}
