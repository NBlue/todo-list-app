import { useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TaskCard, Task } from '@/components/task-card';
import { TaskDialog, TaskFormData } from '@/components/task-dialog';
import { useGetTasks, useTasks } from '@/hooks/use-tasks';

export function Dashboard() {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const { createTask, updateTask, deleteTask } = useTasks();
  const { data: tasks, isLoading } = useGetTasks({});

  const stats = useMemo(() => {
    if (!tasks)
      return { total: 0, completed: 0, inProgress: 0, todo: 0, overdue: 0 };
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todo = tasks.filter((t) => t.status === 'TODO').length;
    const overdue = tasks.filter(
      (t) =>
        t.deadline &&
        new Date(t.deadline) < new Date() &&
        t.status !== 'COMPLETED'
    ).length;

    return { total, completed, inProgress, todo, overdue };
  }, [tasks]);

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = (data: TaskFormData) => {
    const taskData = {
      ...data,
      deadline: data.deadline
        ? new Date(data.deadline).toISOString()
        : undefined,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      createTask(taskData);
    }
    setIsTaskDialogOpen(false);
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask(taskId);
  };

  const handleStatusChange = (taskId: number, status: Task['status']) => {
    updateTask(taskId, { status });
  };

  return (
    <View style={styles.container}>
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <Card style={[styles.statCard, styles.statTotal]}>
          <CardHeader>
            <ThemedText style={styles.statTitle}>Total Tasks</ThemedText>
          </CardHeader>
          <CardContent>
            <ThemedText style={[styles.statValue, styles.statTotalValue]}>
              {stats.total}
            </ThemedText>
          </CardContent>
        </Card>

        <Card style={[styles.statCard, styles.statCompleted]}>
          <CardHeader>
            <ThemedText style={styles.statTitle}>Completed</ThemedText>
          </CardHeader>
          <CardContent>
            <ThemedText style={[styles.statValue, styles.statCompletedValue]}>
              {stats.completed}
            </ThemedText>
            <ThemedText style={styles.statSubtext}>
              {stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0}
              % completion rate
            </ThemedText>
          </CardContent>
        </Card>

        <Card style={[styles.statCard, styles.statProgress]}>
          <CardHeader>
            <ThemedText style={styles.statTitle}>In Progress</ThemedText>
          </CardHeader>
          <CardContent>
            <ThemedText style={[styles.statValue, styles.statProgressValue]}>
              {stats.inProgress}
            </ThemedText>
          </CardContent>
        </Card>

        <Card style={[styles.statCard, styles.statTodo]}>
          <CardHeader>
            <ThemedText style={styles.statTitle}>Todo</ThemedText>
          </CardHeader>
          <CardContent>
            <ThemedText style={[styles.statValue, styles.statTodoValue]}>
              {stats.todo}
            </ThemedText>
          </CardContent>
        </Card>

        <Card style={[styles.statCard, styles.statOverdue]}>
          <CardHeader>
            <ThemedText style={styles.statTitle}>Overdue</ThemedText>
          </CardHeader>
          <CardContent>
            <ThemedText style={[styles.statValue, styles.statOverdueValue]}>
              {stats.overdue}
            </ThemedText>
          </CardContent>
        </Card>
      </View>

      {/* Task Management */}
      <Card style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <ThemedText style={styles.taskTitle} type="defaultSemiBold">
            Task Management
          </ThemedText>
          <Button title="New Task" onPress={handleCreateTask} />
        </View>
        <CardContent>
          {isLoading ? (
            <ThemedText style={styles.emptyText}>Loading tasks...</ThemedText>
          ) : !tasks || tasks.length === 0 ? (
            <ThemedText style={styles.emptyText}>
              No tasks found. Create your first task to get started.
            </ThemedText>
          ) : (
            <View style={styles.taskList}>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </View>
          )}
        </CardContent>
      </Card>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
  },
  statTotal: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  statCompleted: {
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  statProgress: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  statTodo: {
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  statOverdue: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  statTitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTotalValue: { color: '#3b82f6' },
  statCompletedValue: { color: '#22c55e' },
  statProgressValue: { color: '#f59e0b' },
  statTodoValue: { color: '#8b5cf6' },
  statOverdueValue: { color: '#ef4444' },
  statSubtext: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  taskCard: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 18,
  },
  taskList: {
    gap: 0,
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
    opacity: 0.8,
  },
});
