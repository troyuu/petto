import React from 'react';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  header,
  footer,
}) => {
  return (
    <View
      className={`rounded-2xl bg-white dark:bg-dark-card shadow-sm p-4 ${className}`}
    >
      {header && (
        <View className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
          {header}
        </View>
      )}
      <View>{children}</View>
      {footer && (
        <View className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {footer}
        </View>
      )}
    </View>
  );
};

export default React.memo(Card);
