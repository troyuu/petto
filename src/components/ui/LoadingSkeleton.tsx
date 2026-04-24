import React, { useEffect, useRef } from 'react';
import { Animated, type DimensionValue, View } from 'react-native';

interface LoadingSkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className = '',
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1.0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <View className={className}>
      <Animated.View
        style={{
          width,
          height,
          borderRadius,
          opacity,
        }}
        className="bg-gray-200 dark:bg-gray-700"
      />
    </View>
  );
};

export default React.memo(LoadingSkeleton);
