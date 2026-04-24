import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'default' | 'primary' | 'accent';

interface IconButtonProps {
  icon: React.ReactElement;
  onPress: () => void;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  disabled?: boolean;
  className?: string;
  accessibilityLabel: string;
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8 rounded-full',
  md: 'w-10 h-10 rounded-full',
  lg: 'w-12 h-12 rounded-full',
};

const variantClasses: Record<IconButtonVariant, string> = {
  default: 'bg-gray-100 dark:bg-dark-surface',
  primary: 'bg-primary-100 dark:bg-primary-900',
  accent: 'bg-accent-100 dark:bg-accent-900',
};

const variantPressedClasses: Record<IconButtonVariant, string> = {
  default: 'active:bg-gray-200 dark:active:bg-gray-700',
  primary: 'active:bg-primary-200 dark:active:bg-primary-800',
  accent: 'active:bg-accent-200 dark:active:bg-accent-800',
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'md',
  variant = 'default',
  disabled = false,
  className = '',
  accessibilityLabel,
}) => {
  const handlePress = useCallback(() => {
    if (!disabled) {
      onPress();
    }
  }, [disabled, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`items-center justify-center ${sizeClasses[size]} ${
        variantClasses[variant]
      } ${!disabled ? variantPressedClasses[variant] : ''} ${
        disabled ? 'opacity-40' : ''
      } ${className}`}
    >
      <View>{icon}</View>
    </Pressable>
  );
};

export default React.memo(IconButton);
