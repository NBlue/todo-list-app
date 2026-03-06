import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useAuth } from '@/hooks/use-auth';
import { router } from 'expo-router';

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
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                error={errors.password?.message}
              />
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
