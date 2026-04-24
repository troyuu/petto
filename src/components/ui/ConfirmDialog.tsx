import React, { useCallback } from 'react';
import { Text, View } from 'react-native';

import Button from './Button';
import Modal from './Modal';

interface ConfirmDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  destructive = false,
}) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <Modal visible={visible} onClose={onCancel} position="center">
      <View className="items-center px-2">
        <Text className="text-lg font-bold text-text-primary dark:text-text-dark text-center mb-2">
          {title}
        </Text>
        {message && (
          <Text className="text-sm text-text-secondary dark:text-text-muted text-center mb-6">
            {message}
          </Text>
        )}
        <View className="flex-row gap-3 w-full">
          <View className="flex-1">
            <Button
              variant="ghost"
              size="md"
              onPress={handleCancel}
              accessibilityLabel={cancelLabel}
            >
              {cancelLabel}
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant={destructive ? 'destructive' : 'primary'}
              size="md"
              onPress={handleConfirm}
              accessibilityLabel={confirmLabel}
            >
              {confirmLabel}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(ConfirmDialog);
