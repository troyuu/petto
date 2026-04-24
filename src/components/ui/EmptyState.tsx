import React, { useCallback } from 'react';
import { Text, View } from 'react-native';

import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactElement;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  className = '',
}) => {
  const handleAction = useCallback(() => {
    onAction?.();
  }, [onAction]);

  return (
    <View className={`items-center justify-center px-8 py-12 ${className}`}>
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-lg font-semibold text-text-primary dark:text-text-dark text-center mb-2">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-sm text-text-secondary dark:text-text-muted text-center mb-6">
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onPress={handleAction}
          accessibilityLabel={actionLabel}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

export default React.memo(EmptyState);
