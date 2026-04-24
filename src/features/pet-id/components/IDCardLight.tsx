import React from 'react';
import { View, Text, Image } from 'react-native';
import { PawPrint } from 'lucide-react-native';

import { formatAge, formatWeight } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { Pet } from '@/utils/types';

interface IDCardLightProps {
  pet: Pet;
}

const IDCardLight: React.FC<IDCardLightProps> = ({ pet }) => {
  const sexLabel = pet.sex === 'male' ? 'Male' : pet.sex === 'female' ? 'Female' : 'Unknown';

  return (
    <View
      style={{ width: 340, height: 214 }}
      className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-lg flex-row"
      collapsable={false}
    >
      {/* Left: Photo */}
      <View className="w-[40%] bg-accent-100 dark:bg-accent-900 items-center justify-center">
        {pet.photoUri ? (
          <Image
            source={{ uri: pet.photoUri }}
            className="w-full h-full"
            resizeMode="cover"
            accessibilityLabel={`${pet.name} photo`}
          />
        ) : (
          <View className="items-center justify-center">
            <PawPrint size={48} color={colors.accent[500]} />
            <Text className="text-xs text-accent-600 dark:text-accent-300 mt-2 font-medium">
              {pet.name}
            </Text>
          </View>
        )}
      </View>

      {/* Right: Info */}
      <View className="flex-1 p-3 justify-between">
        {/* Header strip */}
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xs font-bold text-accent-500 dark:text-accent-300 uppercase tracking-wider">
            Pet ID
          </Text>
          <PawPrint size={14} color={colors.accent[500]} />
        </View>

        {/* Name and breed */}
        <View className="mb-1">
          <Text className="text-base font-bold text-text-primary dark:text-text-dark" numberOfLines={1}>
            {pet.name}
          </Text>
          {pet.breed ? (
            <Text className="text-[10px] text-muted dark:text-muted-dark" numberOfLines={1}>
              {pet.breed}
            </Text>
          ) : null}
        </View>

        {/* Details */}
        <View className="gap-0.5 mb-1">
          <Text className="text-[10px] text-text-primary dark:text-text-dark">
            <Text className="font-semibold">Sex:</Text> {sexLabel}
          </Text>
          <Text className="text-[10px] text-text-primary dark:text-text-dark">
            <Text className="font-semibold">Age:</Text> {formatAge(pet.birthday)}
          </Text>
          {pet.weight !== null ? (
            <Text className="text-[10px] text-text-primary dark:text-text-dark">
              <Text className="font-semibold">Weight:</Text> {formatWeight(pet.weight, pet.weightUnit)}
            </Text>
          ) : null}
        </View>

        {/* Owner */}
        {(pet.ownerName || pet.ownerContact) ? (
          <View className="pt-1 border-t border-gray-100 dark:border-gray-700 mb-1">
            {pet.ownerName ? (
              <Text className="text-[10px] text-text-primary dark:text-text-dark" numberOfLines={1}>
                <Text className="font-semibold">Owner:</Text> {pet.ownerName}
              </Text>
            ) : null}
            {pet.ownerContact ? (
              <Text className="text-[10px] text-muted dark:text-muted-dark" numberOfLines={1}>
                {pet.ownerContact}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* Allergies */}
        {pet.allergies.length > 0 ? (
          <Text className="text-[10px] text-red-500 font-medium" numberOfLines={1}>
            Allergies: {pet.allergies.join(', ')}
          </Text>
        ) : null}

        {/* Microchip */}
        {pet.microchipNumber ? (
          <View className="pt-1 border-t border-gray-100 dark:border-gray-700">
            <Text className="text-[9px] text-muted dark:text-muted-dark" numberOfLines={1}>
              Chip: {pet.microchipNumber}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default React.memo(IDCardLight);
