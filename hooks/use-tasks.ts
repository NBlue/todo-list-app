import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '@/lib/api/tasks';
import { queryKeys } from '@/lib/react-query';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksRequest,
  Task,
} from '@/types/api';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.list({}) });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskRequest }) =>
      tasksApi.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(
        queryKeys.tasks.detail(updatedTask.id),
        updatedTask
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.list({}) });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.tasks.detail(deletedId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.list({}) });
    },
  });

  const createTask = (data: CreateTaskRequest) =>
    createTaskMutation.mutate(data);
  const updateTask = (id: number, data: UpdateTaskRequest) =>
    updateTaskMutation.mutate({ id, data });
  const deleteTask = (id: number) => deleteTaskMutation.mutate(id);
  const updateTaskStatus = (id: number, status: Task['status']) =>
    updateTaskMutation.mutate({ id, data: { status } });

  return {
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,

    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
};

export const useGetTasks = (params?: GetTasksRequest) => {
  const hasParams = params && Object.keys(params).length > 0;

  return useQuery({
    queryKey: queryKeys.tasks.list(params),
    queryFn: () =>
      hasParams ? tasksApi.getTasksList(params!) : tasksApi.getAllTasks(),
  });
};
