import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Pet } from '@/utils/types';
import { formatAge } from '@/utils/formatters';
import PetAvatar from './PetAvatar';

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
  className?: string;
}

const PetCard = React.memo(function PetCard({
  pet,
  onPress,
  className = '',
}: PetCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`View ${pet.name} details`}
      accessibilityRole="button"
      className={`flex-row items-center rounded-2xl bg-white dark:bg-dark-card p-4 shadow-sm ${className}`}
    >
      <PetAvatar
        photoUri={pet.photoUri}
        petType={pet.petType}
        name={pet.name}
        size="md"
      />

      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-text-primary dark:text-text-dark">
          {pet.name}
        </Text>
        <Text className="text-sm text-muted dark:text-muted-dark mt-0.5">
          {pet.breed ?? 'Unknown breed'}
        </Text>
        <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
          {formatAge(pet.birthday)}
        </Text>
      </View>
    </Pressable>
  );
});

export default PetCard;
