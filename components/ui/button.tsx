import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  ...props
}: ButtonProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const variantStyles = {
    primary: {
      backgroundColor: '#6366f1',
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: '#64748b',
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: tintColor,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    destructive: {
      backgroundColor: '#ef4444',
      borderWidth: 0,
    },
  };

  const textVariantStyles = {
    primary: { color: '#fff' },
    secondary: { color: '#fff' },
    outline: { color: tintColor },
    ghost: { color: textColor },
    destructive: { color: '#fff' },
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variantStyles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Text style={[styles.text, textVariantStyles[variant]]}>Loading...</Text>
      ) : (
        <Text style={[styles.text, textVariantStyles[variant]]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
