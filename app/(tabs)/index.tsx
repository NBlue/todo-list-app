import { ScrollView, StyleSheet, View } from "react-native";

import { Dashboard } from "@/components/dashboard";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import { ThemedText } from "@/components/themed-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <ProtectedRoute>
      <View style={[styles.container, { paddingTop: top }]}>
        <Navbar />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <ThemedText style={styles.heroTitle} type="title">
              Welcome to TaskFlow
            </ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Organize your work, boost your productivity, and achieve your
              goals with our intelligent task management system.
            </ThemedText>
          </View>
          <Dashboard />
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
  },
  heroTitle: {
    textAlign: "center",
    marginBottom: 12,
  },
  heroSubtitle: {
    textAlign: "center",
    opacity: 0.8,
    paddingHorizontal: 24,
  },
});
