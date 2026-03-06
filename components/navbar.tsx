import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';

export function Navbar() {
  const { logout } = useAuth();
  const { user } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <ThemedText style={styles.logo} type="defaultSemiBold">
          TaskFlow
        </ThemedText>
        <ThemedText style={styles.subtitle}>Smart Todo Management</ThemedText>
      </View>

      <View style={styles.actions}>
        <ThemedText style={styles.userName} numberOfLines={1}>
          {user?.name || 'User'}
        </ThemedText>
        <Button
          title="Log out"
          variant="outline"
          onPress={() => logout()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  brand: {
    flex: 1,
  },
  logo: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userName: {
    fontSize: 14,
    maxWidth: 100,
  },
});
