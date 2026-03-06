// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Task Types
export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  deadline?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  deadline?: string;
}

export interface GetTasksRequest {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
