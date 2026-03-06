import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const backgroundColor = useThemeColor(
    { light: '#f8fafc', dark: '#1e293b' },
    'background'
  );
  const textColor = useThemeColor({}, 'text');
  const borderColor = error ? '#ef4444' : '#e2e8f0';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText style={styles.label} type="defaultSemiBold">
          {label}
        </ThemedText>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor,
            color: textColor,
            borderColor,
          },
          style,
        ]}
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {error && (
        <ThemedText style={styles.error} lightColor="#ef4444" darkColor="#f87171">
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});
