import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  linkDescription: string;
  onLinkPress: () => void;
}

export function AuthLayout({
  children,
  title,
  description,
  linkText,
  linkDescription,
  onLinkPress,
}: AuthLayoutProps) {
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <ThemedText style={styles.logo} type="title">
          TaskFlow
        </ThemedText>
        <ThemedText style={styles.subtitle} type="subtitle">
          Smart Todo Management
        </ThemedText>

        <Card style={styles.card}>
          <CardHeader>
            <ThemedText style={styles.title} type="title">
              {title}
            </ThemedText>
            <ThemedText style={styles.description} type="default">
              {description}
            </ThemedText>
          </CardHeader>
          <CardContent>{children}</CardContent>

          <View style={styles.linkContainer}>
            <ThemedText type="default">{linkDescription} </ThemedText>
            <ThemedText
              type="link"
              onPress={onLinkPress}
              style={styles.link}
            >
              {linkText}
            </ThemedText>
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  formContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  logo: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
    opacity: 0.8,
  },
  card: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  link: {
    fontWeight: '600',
  },
});
