import { QueryClient } from '@tanstack/react-query';

import type { GetTasksRequest } from '@/types/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: unknown) => {
        const err = error as { statusCode?: number };
        if (
          err?.statusCode === 401 ||
          err?.statusCode === 403 ||
          err?.statusCode === 404
        ) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error: unknown) => {
        const err = error as { statusCode?: number };
        if (err?.statusCode != null && err.statusCode >= 400 && err.statusCode < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

// Query keys factory
export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
  },

  tasks: {
    all: ['tasks'] as const,
    list: (params?: GetTasksRequest) => ['tasks', 'list', params ?? {}] as const,
    detail: (id: number) => ['tasks', 'detail', id] as const,
    search: (query: string) => ['tasks', 'search', query] as const,
  },
} as const;
