import React from 'react';
import { Text, View } from 'react-native';

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantBgClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 dark:bg-gray-700',
  primary: 'bg-primary-100 dark:bg-primary-900',
  accent: 'bg-accent-100 dark:bg-accent-900',
  success: 'bg-green-100 dark:bg-green-900',
  warning: 'bg-yellow-100 dark:bg-yellow-900',
  danger: 'bg-red-100 dark:bg-red-900',
};

const variantTextClasses: Record<BadgeVariant, string> = {
  default: 'text-gray-700 dark:text-gray-300',
  primary: 'text-primary-700 dark:text-primary-200',
  accent: 'text-accent-700 dark:text-accent-200',
  success: 'text-green-700 dark:text-green-300',
  warning: 'text-yellow-700 dark:text-yellow-300',
  danger: 'text-red-700 dark:text-red-300',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 rounded-full',
  md: 'px-3 py-1 rounded-full',
};

const sizeTextClasses: Record<BadgeSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
};

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  return (
    <View
      className={`self-start ${variantBgClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      <Text
        className={`font-medium ${variantTextClasses[variant]} ${sizeTextClasses[size]}`}
      >
        {label}
      </Text>
    </View>
  );
};

export default React.memo(Badge);
