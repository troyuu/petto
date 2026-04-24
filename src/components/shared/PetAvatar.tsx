import React from 'react';
import { Image, View } from 'react-native';
import { Dog, Cat, PawPrint } from 'lucide-react-native';
import type { PetType } from '@/utils/types';
import { colors } from '@/utils/colors';

interface PetAvatarProps {
  photoUri: string | null;
  petType: PetType;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 40,
  md: 56,
  lg: 80,
} as const;

const ICON_SIZE_MAP = {
  sm: 20,
  md: 28,
  lg: 40,
} as const;

function getFallbackIcon(petType: PetType, iconSize: number) {
  const iconColor = colors.primary[500];

  switch (petType) {
    case 'dog':
      return <Dog size={iconSize} color={iconColor} />;
    case 'cat':
      return <Cat size={iconSize} color={iconColor} />;
    case 'other':
      return <PawPrint size={iconSize} color={iconColor} />;
  }
}

const PetAvatar = React.memo(function PetAvatar({
  photoUri,
  petType,
  name,
  size = 'md',
  className = '',
}: PetAvatarProps) {
  const pixelSize = SIZE_MAP[size];
  const iconSize = ICON_SIZE_MAP[size];

  if (photoUri) {
    return (
      <Image
        source={{ uri: photoUri }}
        style={{ width: pixelSize, height: pixelSize }}
        className={`rounded-full ${className}`}
        accessibilityLabel={`${name} photo`}
      />
    );
  }

  return (
    <View
      style={{ width: pixelSize, height: pixelSize }}
      className={`rounded-full bg-primary-100 dark:bg-primary-800 items-center justify-center ${className}`}
      accessibilityLabel={`${name} avatar`}
    >
      {getFallbackIcon(petType, iconSize)}
    </View>
  );
});

export default PetAvatar;
