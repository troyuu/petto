import React, { useCallback } from 'react';
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

import { formatCurrency, formatDate } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { Expense, ExpenseCategory } from '@/utils/types';

interface ExpenseEntryCardProps {
  expense: Expense;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CATEGORY_ICONS: Record<ExpenseCategory, LucideIcon> = {
  food: UtensilsCrossed,
  vet_bills: Stethoscope,
  grooming: Scissors,
  accessories: ShoppingBag,
  medication: Pill,
  insurance: Shield,
  other: MoreHorizontal,
};

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Food',
  vet_bills: 'Vet Bills',
  grooming: 'Grooming',
  accessories: 'Accessories',
  medication: 'Medication',
  insurance: 'Insurance',
  other: 'Other',
};

const ExpenseEntryCard: React.FC<ExpenseEntryCardProps> = ({
  expense,
  onPress,
  onEdit: _onEdit,
  onDelete: _onDelete,
}) => {
  const Icon = CATEGORY_ICONS[expense.category] ?? MoreHorizontal;
  const categoryLabel = CATEGORY_LABELS[expense.category] ?? 'Other';

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={`${categoryLabel} expense: ${formatCurrency(expense.amount, expense.currency)}`}
      accessibilityRole="button"
      className="flex-row items-center bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm"
    >
      <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-3">
        <Icon size={20} color={colors.primary[500]} />
      </View>

      <View className="flex-1">
        <Text className="text-sm font-semibold text-text-primary dark:text-text-dark" numberOfLines={1}>
          {expense.description ?? categoryLabel}
        </Text>
        <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
          {categoryLabel} · {formatDate(expense.expenseDate)}
        </Text>
      </View>

      <Text className="text-sm font-bold text-text-primary dark:text-text-dark ml-2">
        {formatCurrency(expense.amount, expense.currency)}
      </Text>
    </Pressable>
  );
};

export default React.memo(ExpenseEntryCard);
