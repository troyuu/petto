import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

interface FABProps {
  icon: React.ReactElement;
  onPress: () => void;
  accessibilityLabel: string;
  className?: string;
  extended?: boolean;
  label?: string;
  position?: 'bottom-right';
}

const FAB: React.FC<FABProps> = ({
  icon,
  onPress,
  accessibilityLabel,
  className = '',
  extended = false,
  label,
  position: _position = 'bottom-right',
}) => {
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className={`absolute bottom-6 right-6 bg-primary-500 dark:bg-primary-400 shadow-lg items-center justify-center active:opacity-80 ${
        extended ? 'flex-row rounded-2xl px-5 py-4 gap-2' : 'rounded-full w-14 h-14'
      } ${className}`}
    >
      <View>{icon}</View>
      {extended && label && (
        <Text className="text-white font-semibold text-base">{label}</Text>
      )}
    </Pressable>
  );
};

export default React.memo(FAB);
