import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  className?: string;
  accessibilityLabel: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 dark:bg-primary-400',
  secondary: 'bg-accent-500 dark:bg-accent-400',
  outline: 'border-2 border-primary-500 dark:border-primary-400 bg-transparent',
  ghost: 'bg-transparent',
  destructive: 'bg-red-500 dark:bg-red-400',
};

const variantPressedClasses: Record<ButtonVariant, string> = {
  primary: 'active:opacity-80',
  secondary: 'active:opacity-80',
  outline: 'active:opacity-80 active:bg-primary-50 dark:active:bg-primary-900',
  ghost: 'active:opacity-80 active:bg-primary-50 dark:active:bg-dark-surface',
  destructive: 'active:opacity-80',
};

const variantDisabledClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-200 dark:bg-primary-800',
  secondary: 'bg-accent-200 dark:bg-accent-800',
  outline: 'border-2 border-primary-200 dark:border-primary-800 bg-transparent',
  ghost: 'bg-transparent',
  destructive: 'bg-red-200 dark:bg-red-800',
};

const variantTextClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-primary-500 dark:text-primary-400',
  ghost: 'text-primary-500 dark:text-primary-400',
  destructive: 'text-white',
};

const variantDisabledTextClasses: Record<ButtonVariant, string> = {
  primary: 'text-white/60',
  secondary: 'text-white/60',
  outline: 'text-primary-200 dark:text-primary-800',
  ghost: 'text-primary-200 dark:text-primary-800',
  destructive: 'text-white/60',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 rounded-lg',
  md: 'px-5 py-2.5 rounded-xl',
  lg: 'px-7 py-3.5 rounded-xl',
};

const sizeTextClasses: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const sizeIconSpacing: Record<ButtonSize, string> = {
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
};

const indicatorSizes: Record<ButtonSize, 'small' | 'large'> = {
  sm: 'small',
  md: 'small',
  lg: 'large',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  children,
  leftIcon,
  rightIcon,
  className = '',
  accessibilityLabel,
}) => {
  const isDisabled = disabled || loading;

  const handlePress = useCallback(() => {
    if (!isDisabled) {
      onPress();
    }
  }, [isDisabled, onPress]);

  const baseClasses = isDisabled
    ? variantDisabledClasses[variant]
    : variantClasses[variant];

  const textClasses = isDisabled
    ? variantDisabledTextClasses[variant]
    : variantTextClasses[variant];

  const indicatorColor =
    variant === 'outline' || variant === 'ghost' ? '#2D6A4F' : '#FFFFFF';

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`flex-row items-center justify-center ${sizeClasses[size]} ${baseClasses} ${
        !isDisabled ? variantPressedClasses[variant] : ''
      } ${sizeIconSpacing[size]} ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          size={indicatorSizes[size]}
          color={indicatorColor}
        />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          <Text
            className={`font-semibold ${sizeTextClasses[size]} ${textClasses}`}
          >
            {children}
          </Text>
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
};

export default React.memo(Button);
