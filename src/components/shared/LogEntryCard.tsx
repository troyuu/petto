import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { formatTime } from '@/utils/formatters';
import { colors } from '@/utils/colors';

interface LogEntryCardProps {
  icon: React.ReactElement;
  title: string;
  subtitle: string;
  timestamp: string;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const LogEntryCard = React.memo(function LogEntryCard({
  icon,
  title,
  subtitle,
  timestamp,
  onPress,
  onEdit,
  onDelete,
  className = '',
}: LogEntryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`${title} log entry`}
      accessibilityRole="button"
      className={`flex-row items-center rounded-2xl bg-white dark:bg-dark-card p-4 shadow-sm ${className}`}
    >
      <View className="mr-3">{icon}</View>

      <View className="flex-1">
        <Text className="text-sm font-semibold text-text-primary dark:text-text-dark">
          {title}
        </Text>
        <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
          {subtitle}
        </Text>
      </View>

      <View className="items-end ml-2">
        <Text className="text-xs text-muted dark:text-muted-dark mb-2">
          {formatTime(timestamp)}
        </Text>

        <View className="flex-row gap-2">
          {onEdit && (
            <Pressable
              onPress={onEdit}
              accessibilityLabel={`Edit ${title}`}
              accessibilityRole="button"
              hitSlop={8}
            >
              <Pencil size={16} color={colors.muted} />
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              onPress={onDelete}
              accessibilityLabel={`Delete ${title}`}
              accessibilityRole="button"
              hitSlop={8}
            >
              <Trash2 size={16} color={colors.danger} />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
});

export default LogEntryCard;
