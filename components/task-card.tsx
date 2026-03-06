import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { format } from 'date-fns';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  onStatusChange?: (taskId: number, status: Task['status']) => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(task.status === 'COMPLETED');

  // Sync with task status when it changes from parent
  useEffect(() => {
    setIsCompleted(task.status === 'COMPLETED');
  }, [task.status]);
  const backgroundColor = useThemeColor(
    { light: '#ffffff', dark: '#1e293b' },
    'background'
  );

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== 'COMPLETED';

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'TODO':
        return '#64748b';
      case 'IN_PROGRESS':
        return '#3b82f6';
      case 'COMPLETED':
        return '#22c55e';
      default:
        return '#64748b';
    }
  };

  const handleStatusToggle = () => {
    const newStatus = isCompleted ? 'TODO' : 'COMPLETED';
    setIsCompleted(!isCompleted);
    onStatusChange?.(task.id, newStatus);
  };

  const handleEdit = () => onEdit?.(task);

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete?.(task.id),
        },
      ]
    );
  };

  const showActions = () => {
    Alert.alert(
      task.title,
      'Choose an action',
      [
        {
          text: 'Edit',
          onPress: () => onEdit?.(task),
        },
        {
          text: 'Mark as Todo',
          onPress: () => onStatusChange?.(task.id, 'TODO'),
          style: task.status === 'TODO' ? 'cancel' : undefined,
        },
        {
          text: 'Mark as In Progress',
          onPress: () => onStatusChange?.(task.id, 'IN_PROGRESS'),
          style: task.status === 'IN_PROGRESS' ? 'cancel' : undefined,
        },
        {
          text: 'Mark as Completed',
          onPress: () => onStatusChange?.(task.id, 'COMPLETED'),
          style: task.status === 'COMPLETED' ? 'cancel' : undefined,
        },
        {
          text: 'Delete',
          onPress: handleDelete,
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <Pressable
      style={[styles.card, { backgroundColor }]}
      onLongPress={showActions}
    >
      <View style={styles.header}>
        <Pressable
          style={[
            styles.checkbox,
            isCompleted && styles.checkboxCompleted,
          ]}
          onPress={handleStatusToggle}
        >
          {isCompleted && <ThemedText style={styles.checkmark}>✓</ThemedText>}
        </Pressable>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <ThemedText
              style={[
                styles.title,
                isCompleted && styles.titleCompleted,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </ThemedText>
            <View style={styles.actionButtons}>
              <Pressable
                style={styles.iconButton}
                onPress={handleEdit}
                hitSlop={8}
              >
                <MaterialIcons name="edit" size={20} color="#64748b" />
              </Pressable>
              <Pressable
                style={styles.iconButton}
                onPress={handleDelete}
                hitSlop={8}
              >
                <MaterialIcons name="delete" size={20} color="#ef4444" />
              </Pressable>
            </View>
          </View>
          <View style={styles.badges}>
            <View
              style={[
                styles.badge,
                { backgroundColor: getStatusColor(task.status) + '20' },
              ]}
            >
              <ThemedText
                style={[styles.badgeText, { color: getStatusColor(task.status) }]}
              >
                {task.status.replace('_', ' ')}
              </ThemedText>
            </View>
            {isOverdue && (
              <View style={[styles.badge, styles.overdueBadge]}>
                <ThemedText style={styles.overdueText}>Overdue</ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>

      {task.description ? (
        <ThemedText
          style={[styles.description, isCompleted && styles.titleCompleted]}
          numberOfLines={3}
        >
          {task.description.replace(/<[^>]*>/g, '')}
        </ThemedText>
      ) : null}

      <View style={styles.footer}>
        {task.deadline ? (
          <ThemedText
            style={[styles.date, isOverdue && styles.overdueText]}
          >
            {format(new Date(task.deadline), 'MMM dd, yyyy')}
          </ThemedText>
        ) : null}
        <ThemedText style={styles.date}>
          Created {format(new Date(task.createdAt), 'MMM dd')}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#64748b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  overdueBadge: {
    backgroundColor: '#fef2f2',
  },
  overdueText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 12,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
});
