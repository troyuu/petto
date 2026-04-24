import React from 'react';
import { View, Text, Image } from 'react-native';
import { PawPrint } from 'lucide-react-native';

import { formatAge, formatWeight } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { Pet } from '@/utils/types';

interface IDCardTemplateProps {
  pet: Pet;
}

const IDCardTemplate: React.FC<IDCardTemplateProps> = ({ pet }) => {
  const sexLabel = pet.sex === 'male' ? 'Male' : pet.sex === 'female' ? 'Female' : 'Unknown';

  return (
    <View
      style={{ width: 340, minHeight: 214 }}
      className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-lg"
      collapsable={false}
    >
      {/* Header */}
      <View className="bg-primary-500 px-4 py-3 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-white">PET ID</Text>
        <PawPrint size={20} color="#FFFFFF" />
      </View>

      {/* Body */}
      <View className="p-4">
        <View className="flex-row mb-3">
          {/* Pet Photo */}
          <View className="mr-4">
            {pet.photoUri ? (
              <Image
                source={{ uri: pet.photoUri }}
                style={{ width: 72, height: 72 }}
                className="rounded-full"
                accessibilityLabel={`${pet.name} photo`}
              />
            ) : (
              <View
                style={{ width: 72, height: 72 }}
                className="rounded-full bg-primary-100 dark:bg-primary-800 items-center justify-center"
              >
                <PawPrint size={32} color={colors.primary[500]} />
              </View>
            )}
          </View>

          {/* Basic Info */}
          <View className="flex-1">
            <Text className="text-lg font-bold text-text-primary dark:text-text-dark" numberOfLines={1}>
              {pet.name}
            </Text>
            {pet.breed ? (
              <Text className="text-xs text-muted dark:text-muted-dark">{pet.breed}</Text>
            ) : null}
            <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
              {sexLabel} · {formatAge(pet.birthday)}
            </Text>
            {pet.weight !== null ? (
              <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
                {formatWeight(pet.weight, pet.weightUnit)}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Owner Info */}
        {(pet.ownerName || pet.ownerContact) ? (
          <View className="mb-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            {pet.ownerName ? (
              <Text className="text-xs text-text-primary dark:text-text-dark">
                <Text className="font-semibold">Owner:</Text> {pet.ownerName}
              </Text>
            ) : null}
            {pet.ownerContact ? (
              <Text className="text-xs text-muted dark:text-muted-dark">
                {pet.ownerContact}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* Allergies */}
        {pet.allergies.length > 0 ? (
          <View className="mb-2">
            <Text className="text-xs font-semibold text-red-500">
              Allergies: {pet.allergies.join(', ')}
            </Text>
          </View>
        ) : null}

        {/* Microchip */}
        {pet.microchipNumber ? (
          <View className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <Text className="text-xs text-muted dark:text-muted-dark">
              <Text className="font-semibold">Microchip:</Text> {pet.microchipNumber}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default React.memo(IDCardTemplate);
