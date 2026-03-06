import { useEffect } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task } from './task-card';

const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
  deadline: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSave: (data: TaskFormData) => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS: { value: TaskFormData['status']; label: string }[] = [
  { value: 'TODO', label: 'Todo' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

export function TaskDialog({
  open,
  onOpenChange,
  task,
  onSave,
  isLoading = false,
}: TaskDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      deadline: '',
    },
  });

  useEffect(() => {
    if (open && task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        deadline: task.deadline
          ? new Date(task.deadline).toISOString().split('T')[0]
          : '',
      });
    } else if (open) {
      reset({
        title: '',
        description: '',
        status: 'TODO',
        deadline: '',
      });
    }
  }, [open, task, reset]);

  const onSubmit = (data: TaskFormData) => {
    onSave({
      ...data,
      deadline: data.deadline || undefined,
    });
    onOpenChange(false);
  };

  const backgroundColor = useThemeColor(
    { light: '#ffffff', dark: '#1e293b' },
    'background'
  );

  if (!open) return null;

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable
        style={styles.overlay}
        onPress={() => onOpenChange(false)}
      >
        <Pressable
          style={[styles.modal, { backgroundColor }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <ThemedText style={styles.title} type="title">
              {task ? 'Edit Task' : 'Create New Task'}
            </ThemedText>
            <ThemedText style={styles.description}>
              {task
                ? 'Update your task details.'
                : 'Create a new task and start organizing your work.'}
            </ThemedText>
          </View>

          <ScrollView
            style={styles.form}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Task Title"
                  placeholder="Enter task title..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.title?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <View style={styles.field}>
                  <ThemedText style={styles.label} type="defaultSemiBold">
                    Status
                  </ThemedText>
                  <View style={styles.statusOptions}>
                    {STATUS_OPTIONS.map((opt) => (
                      <Pressable
                        key={opt.value}
                        style={[
                          styles.statusOption,
                          value === opt.value && styles.statusOptionActive,
                        ]}
                        onPress={() => onChange(opt.value)}
                      >
                        <ThemedText
                          style={
                            value === opt.value
                              ? styles.statusOptionTextActive
                              : undefined
                          }
                        >
                          {opt.label}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            />

            <Controller
              control={control}
              name="deadline"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Deadline (YYYY-MM-DD)"
                  placeholder="e.g. 2024-12-31"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.deadline?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Description (optional)"
                  placeholder="Add detailed description..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={4}
                  style={styles.descriptionInput}
                />
              )}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => onOpenChange(false)}
              disabled={isLoading}
            />
            <Button
              title={task ? 'Update Task' : 'Create Task'}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
  },
  form: {
    maxHeight: 400,
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusOptionActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  statusOptionTextActive: {
    color: '#fff',
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
});
