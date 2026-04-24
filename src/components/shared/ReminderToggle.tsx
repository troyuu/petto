import React from 'react';
import { View, Text, Switch } from 'react-native';
import { colors } from '@/utils/colors';

interface ReminderToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  label: string;
  className?: string;
}

const ReminderToggle = React.memo(function ReminderToggle({
  enabled,
  onToggle,
  label,
  className = '',
}: ReminderToggleProps) {
  return (
    <View className={`flex-row items-center justify-between py-3 ${className}`}>
      <Text className="text-base text-text-primary dark:text-text-dark flex-1 mr-3">
        {label}
      </Text>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{
          false: colors.muted,
          true: colors.primary[400],
        }}
        thumbColor={enabled ? colors.primary[500] : '#F4F4F5'}
        accessibilityLabel={label}
        accessibilityRole="switch"
      />
    </View>
  );
});

export default ReminderToggle;
