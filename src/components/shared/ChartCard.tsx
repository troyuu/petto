import React from 'react';
import { View, Text } from 'react-native';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard = React.memo(function ChartCard({
  title,
  subtitle,
  children,
  className = '',
}: ChartCardProps) {
  return (
    <View
      className={`rounded-2xl bg-white dark:bg-dark-card p-4 shadow-sm ${className}`}
    >
      <View className="mb-3">
        <Text className="text-base font-semibold text-text-primary dark:text-text-dark">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-muted dark:text-muted-dark mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>

      <View style={{ minHeight: 200 }}>{children}</View>
    </View>
  );
});

export default ChartCard;
