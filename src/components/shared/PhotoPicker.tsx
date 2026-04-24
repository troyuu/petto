import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Camera, X } from 'lucide-react-native';
import { colors } from '@/utils/colors';

interface PhotoPickerProps {
  photoUri: string | null;
  onPhotoSelected: (uri: string) => void;
  onRemove?: () => void;
  className?: string;
  label?: string;
}

const PhotoPicker = React.memo(function PhotoPicker({
  photoUri,
  onPhotoSelected,
  onRemove,
  className = '',
  label = 'Add Photo',
}: PhotoPickerProps) {
  const handlePress = () => {
    // Placeholder: in a real implementation, show an ActionSheet
    // with Camera / Gallery options using react-native-image-picker
    onPhotoSelected('placeholder-uri');
  };

  if (photoUri) {
    return (
      <View className={`relative aspect-square rounded-xl overflow-hidden ${className}`}>
        <Image
          source={{ uri: photoUri }}
          className="w-full h-full"
          resizeMode="cover"
          accessibilityLabel={label}
        />
        {onRemove && (
          <Pressable
            onPress={onRemove}
            accessibilityLabel="Remove photo"
            accessibilityRole="button"
            className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5"
          >
            <X size={16} color="#FFFFFF" />
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={label}
      accessibilityRole="button"
      className={`aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 items-center justify-center bg-gray-50 dark:bg-dark-card ${className}`}
    >
      <Camera size={32} color={colors.muted} />
      <Text className="text-sm text-muted dark:text-muted-dark mt-2">
        {label}
      </Text>
    </Pressable>
  );
});

export default PhotoPicker;
