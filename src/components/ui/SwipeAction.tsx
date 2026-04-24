import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SwipeActionProps {
  onEdit?: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

const ACTION_WIDTH = 80;
const SPRING_CONFIG = { damping: 20, stiffness: 200 };

const SwipeAction: React.FC<SwipeActionProps> = ({
  onEdit,
  onDelete,
  children,
}) => {
  const translateX = useSharedValue(0);
  const contextX = useSharedValue(0);

  const handleEdit = useCallback(() => {
    onEdit?.();
  }, [onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.();
  }, [onDelete]);

  const maxLeftSwipe = onDelete ? -ACTION_WIDTH : 0;
  const maxRightSwipe = onEdit ? ACTION_WIDTH : 0;

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
    })
    .onUpdate((event) => {
      const nextX = contextX.value + event.translationX;
      translateX.value = Math.max(maxLeftSwipe, Math.min(maxRightSwipe, nextX));
    })
    .onEnd(() => {
      if (translateX.value > ACTION_WIDTH * 0.5 && onEdit) {
        translateX.value = withSpring(ACTION_WIDTH, SPRING_CONFIG);
      } else if (translateX.value < -ACTION_WIDTH * 0.5 && onDelete) {
        translateX.value = withSpring(-ACTION_WIDTH, SPRING_CONFIG);
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
      }
    })
    .activeOffsetX([-10, 10]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const editActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? 1 : 0,
  }));

  const deleteActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? 1 : 0,
  }));

  const handleEditPress = useCallback(() => {
    translateX.value = withSpring(0, SPRING_CONFIG);
    handleEdit();
  }, [translateX, handleEdit]);

  const handleDeletePress = useCallback(() => {
    translateX.value = withSpring(0, SPRING_CONFIG);
    handleDelete();
  }, [translateX, handleDelete]);

  return (
    <View className="relative overflow-hidden">
      {/* Edit action (revealed on right swipe) */}
      {onEdit && (
        <Animated.View
          style={editActionStyle}
          className="absolute left-0 top-0 bottom-0 justify-center"
        >
          <Pressable
            onPress={handleEditPress}
            accessibilityLabel="Edit"
            accessibilityRole="button"
            className="bg-blue-500 w-20 h-full items-center justify-center"
          >
            <Text className="text-white font-semibold text-sm">Edit</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Delete action (revealed on left swipe) */}
      {onDelete && (
        <Animated.View
          style={deleteActionStyle}
          className="absolute right-0 top-0 bottom-0 justify-center"
        >
          <Pressable
            onPress={handleDeletePress}
            accessibilityLabel="Delete"
            accessibilityRole="button"
            className="bg-red-500 w-20 h-full items-center justify-center"
          >
            <Text className="text-white font-semibold text-sm">Delete</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Main content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
};

export default React.memo(SwipeAction);
