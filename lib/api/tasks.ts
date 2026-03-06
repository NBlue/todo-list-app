import apiClient from './axios';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksRequest,
  ApiResponse,
} from '@/types/api';

interface PaginatedTasksResponse {
  data: Task[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const tasksApi = {
  // Get all tasks (no pagination)
  getAllTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/task');
    return response.data.data;
  },

  // Get paginated tasks with filters
  getTasksList: async (params: GetTasksRequest): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<PaginatedTasksResponse>>(
      '/task/list',
      { params }
    );
    return response.data.data.data;
  },

  // Get single task by ID
  getTask: async (id: number): Promise<Task> => {
    const response = await apiClient.get<ApiResponse<Task>>(`/task/${id}`);
    return response.data.data;
  },

  // Create new task
  createTask: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>('/task', data);
    return response.data.data;
  },

  // Update task
  updateTask: async (id: number, data: UpdateTaskRequest): Promise<Task> => {
    const response = await apiClient.put<ApiResponse<Task>>(
      `/task/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete task
  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/task/${id}`);
  },
};
