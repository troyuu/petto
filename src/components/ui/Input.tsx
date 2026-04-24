import React, { useCallback, useState } from 'react';
import { Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  className?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  leftIcon,
  rightIcon,
  multiline = false,
  secureTextEntry = false,
  keyboardType,
  className = '',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const borderClass = error
    ? 'border-red-500'
    : isFocused
      ? 'border-primary-500 dark:border-primary-400'
      : 'border-gray-200 dark:border-gray-600';

  return (
    <View className={`${className}`}>
      {label && (
        <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-1.5">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center border-2 rounded-xl bg-white dark:bg-dark-surface px-3 ${borderClass} ${
          multiline ? 'min-h-[100px] items-start py-2.5' : 'h-12'
        }`}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          className="flex-1 text-base text-text-primary dark:text-text-dark py-0"
        />
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-sm text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
};

export default React.memo(Input);
