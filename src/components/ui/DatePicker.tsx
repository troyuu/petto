import React, { useCallback, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import dayjs from 'dayjs';

type DatePickerMode = 'date' | 'time' | 'datetime';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  mode?: DatePickerMode;
  label?: string;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  accessibilityLabel?: string;
}

const formatValue = (value: Date | null, mode: DatePickerMode): string => {
  if (!value) {
    switch (mode) {
      case 'date':
        return 'Select date';
      case 'time':
        return 'Select time';
      case 'datetime':
        return 'Select date & time';
    }
  }

  const d = dayjs(value);
  switch (mode) {
    case 'date':
      return d.format('MMM D, YYYY');
    case 'time':
      return d.format('h:mm A');
    case 'datetime':
      return d.format('MMM D, YYYY h:mm A');
  }
};

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange: _onChange,
  mode = 'date',
  label,
  error,
  minimumDate: _minimumDate,
  maximumDate: _maximumDate,
  accessibilityLabel,
}) => {
  const formattedValue = useMemo(() => formatValue(value, mode), [value, mode]);

  const iconColor = '#6B7280';

  const handlePress = useCallback(() => {
    // Native picker integration to be added later.
    // This is a controlled display component.
  }, []);

  const borderClass = error
    ? 'border-red-500'
    : 'border-gray-200 dark:border-gray-600';

  const icon =
    mode === 'time' ? (
      <Clock size={20} color={iconColor} />
    ) : (
      <Calendar size={20} color={iconColor} />
    );

  return (
    <View>
      {label && (
        <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-1.5">
          {label}
        </Text>
      )}
      <Pressable
        onPress={handlePress}
        accessibilityLabel={accessibilityLabel ?? label ?? 'Date picker'}
        accessibilityRole="button"
        className={`flex-row items-center h-12 border-2 rounded-xl bg-white dark:bg-dark-surface px-3 ${borderClass}`}
      >
        <View className="mr-2">{icon}</View>
        <Text
          className={`flex-1 text-base ${
            value
              ? 'text-text-primary dark:text-text-dark'
              : 'text-text-muted'
          }`}
        >
          {formattedValue}
        </Text>
      </Pressable>
      {error && (
        <Text className="text-sm text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
};

export default React.memo(DatePicker);
