import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useState } from 'react';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { isLoading: isAuthLoading, shouldShowContent } = useAuthGuard();
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      login(data);
    } catch {
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  if (isAuthLoading || !shouldShowContent) {
    return null;
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials to access your account"
      linkText="Sign up"
      linkHref="/(auth)/register"
      linkDescription="Don't have an account?"
      onLinkPress={() => router.push('/register' as never)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email address"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ position: 'relative' }}>
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                  error={errors.password?.message}
                />
                <View
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 30,
                    bottom: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <Button
            title={isLoggingIn ? 'Signing in...' : 'Sign in'}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoggingIn}
            loading={isLoggingIn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}
