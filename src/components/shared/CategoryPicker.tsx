import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  UtensilsCrossed,
  Stethoscope,
  Scissors,
  ShoppingBag,
  Pill,
  Shield,
  MoreHorizontal,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/utils/colors';

interface CategoryItem {
  label: string;
  value: string;
  icon: string;
}

interface CategoryPickerProps {
  categories: CategoryItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Stethoscope,
  Scissors,
  ShoppingBag,
  Pill,
  Shield,
  MoreHorizontal,
};

const CategoryPicker = React.memo(function CategoryPicker({
  categories,
  selectedValue,
  onSelect,
  className = '',
}: CategoryPickerProps) {
  return (
    <View className={`flex-row flex-wrap gap-2 ${className}`}>
      {categories.map((category) => {
        const isSelected = category.value === selectedValue;
        const IconComponent = ICON_MAP[category.icon];
        const iconColor = isSelected ? colors.primary[500] : colors.muted;

        return (
          <Pressable
            key={category.value}
            onPress={() => onSelect(category.value)}
            accessibilityLabel={`Select ${category.label} category`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            className={`w-[31%] items-center rounded-xl p-3 ${
              isSelected
                ? 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-900'
                : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card'
            }`}
          >
            {IconComponent && <IconComponent size={24} color={iconColor} />}
            <Text
              className={`text-xs mt-1.5 text-center ${
                isSelected
                  ? 'font-semibold text-primary-500 dark:text-primary-300'
                  : 'text-muted dark:text-muted-dark'
              }`}
            >
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

export default CategoryPicker;
