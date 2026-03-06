import { StyleSheet, View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, ...props }: CardProps) {
  const backgroundColor = useThemeColor(
    { light: '#ffffff', dark: '#1e293b' },
    'background'
  );

  return (
    <View style={[styles.card, { backgroundColor }, style]} {...props}>
      {children}
    </View>
  );
}

export function CardHeader({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.title, style]} {...props}>
      {children}
    </View>
  );
}

export function CardContent({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  content: {},
});
