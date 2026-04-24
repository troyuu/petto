import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  UtensilsCrossed,
  Droplets,
  Beef,
  ChefHat,
  Cookie,
} from 'lucide-react-native';
import type { Feeding, FoodType } from '@/utils/types';
import { formatTime } from '@/utils/formatters';
import { colors } from '@/utils/colors';

interface FeedingEntryCardProps {
  feeding: Feeding;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function getFoodTypeIcon(foodType: FoodType): React.ReactElement {
  const size = 20;
  const color = colors.primary[500];

  switch (foodType) {
    case 'dry':
      return <UtensilsCrossed size={size} color={color} />;
    case 'wet':
      return <Droplets size={size} color={color} />;
    case 'raw':
      return <Beef size={size} color={color} />;
    case 'homemade':
      return <ChefHat size={size} color={color} />;
    case 'treats':
      return <Cookie size={size} color={color} />;
  }
}

function getFoodTypeLabel(foodType: FoodType): string {
  switch (foodType) {
    case 'dry':
      return 'Dry Food';
    case 'wet':
      return 'Wet Food';
    case 'raw':
      return 'Raw Food';
    case 'homemade':
      return 'Homemade';
    case 'treats':
      return 'Treats';
  }
}

function formatPortion(feeding: Feeding): string {
  if (feeding.portionSize === null) return '';
  return `${feeding.portionSize} ${feeding.portionUnit}`;
}

const FeedingEntryCard = React.memo(function FeedingEntryCard({
  feeding,
  onPress,
  onEdit,
  onDelete,
}: FeedingEntryCardProps) {
  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const handleEdit = useCallback(() => {
    onEdit?.();
  }, [onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.();
  }, [onDelete]);

  const icon = getFoodTypeIcon(feeding.foodType);
  const title = feeding.foodBrand
    ? `${getFoodTypeLabel(feeding.foodType)} - ${feeding.foodBrand}`
    : getFoodTypeLabel(feeding.foodType);
  const portion = formatPortion(feeding);
  const time = formatTime(feeding.fedAt);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={`${title} feeding entry`}
      accessibilityRole="button"
      className="flex-row items-center rounded-2xl bg-white dark:bg-dark-card p-4 shadow-sm mb-2 active:opacity-80"
    >
      <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-3">
        {icon}
      </View>

      <View className="flex-1">
        <Text
          className="text-sm font-semibold text-text-primary dark:text-text-dark"
          numberOfLines={1}
        >
          {title}
        </Text>
        {portion !== '' && (
          <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
            {portion}
          </Text>
        )}
      </View>

      <View className="items-end ml-2">
        <Text className="text-xs text-muted dark:text-muted-dark">{time}</Text>
        <View className="flex-row gap-3 mt-2">
          {onEdit && (
            <Pressable
              onPress={handleEdit}
              accessibilityLabel={`Edit ${title} feeding`}
              accessibilityRole="button"
              hitSlop={8}
            >
              <Text className="text-xs font-medium text-blue-500">Edit</Text>
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              onPress={handleDelete}
              accessibilityLabel={`Delete ${title} feeding`}
              accessibilityRole="button"
              hitSlop={8}
            >
              <Text className="text-xs font-medium text-red-500">Delete</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
});

export default FeedingEntryCard;
