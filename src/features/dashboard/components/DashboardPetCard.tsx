import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Pet } from '@/utils/types';
import { PetAvatar } from '@/components/shared';

interface DashboardPetCardProps {
  pet: Pet;
  isSelected: boolean;
  onPress: (pet: Pet) => void;
}

const DashboardPetCard = React.memo(function DashboardPetCard({
  pet,
  isSelected,
  onPress,
}: DashboardPetCardProps) {
  const handlePress = useCallback(() => {
    onPress(pet);
  }, [pet, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={`Select ${pet.name}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`items-center mr-3 rounded-2xl px-3 py-2 ${
        isSelected
          ? 'border-2 border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900'
          : 'border border-gray-200 bg-white dark:border-gray-700 dark:bg-dark-card'
      }`}
    >
      <PetAvatar
        photoUri={pet.photoUri}
        petType={pet.petType}
        name={pet.name}
        size="sm"
      />
      <Text
        className={`text-xs mt-1.5 font-medium ${
          isSelected
            ? 'text-primary-600 dark:text-primary-300'
            : 'text-text-primary dark:text-text-dark'
        }`}
        numberOfLines={1}
      >
        {pet.name}
      </Text>
    </Pressable>
  );
});

export default DashboardPetCard;
