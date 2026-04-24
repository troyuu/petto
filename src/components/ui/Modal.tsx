import React, { useCallback } from 'react';
import {
  Modal as RNModal,
  Pressable,
  Text,
  View,
} from 'react-native';

type ModalPosition = 'center' | 'bottom';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: ModalPosition;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  position = 'center',
}) => {
  const handleBackdropPress = useCallback(() => {
    onClose();
  }, [onClose]);

  const isBottom = position === 'bottom';

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={isBottom ? 'slide' : 'fade'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={handleBackdropPress}
        accessibilityLabel="Close modal"
        accessibilityRole="button"
        className={`flex-1 bg-black/50 ${
          isBottom ? 'justify-end' : 'justify-center items-center px-6'
        }`}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className={`bg-white dark:bg-dark-card ${
            isBottom
              ? 'rounded-t-3xl px-5 pt-5 pb-8 w-full'
              : 'rounded-2xl px-5 py-5 w-full max-w-md'
          }`}
        >
          {isBottom && (
            <View className="items-center mb-3">
              <View className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </View>
          )}
          {title && (
            <Text className="text-lg font-bold text-text-primary dark:text-text-dark mb-4">
              {title}
            </Text>
          )}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
};

export default React.memo(Modal);
