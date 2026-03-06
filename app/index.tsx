import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';

export default function Index() {
  const { isAuthenticated, accessToken } = useAuthStore();

  if (isAuthenticated && accessToken) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href={'/login' as never} />;
}
