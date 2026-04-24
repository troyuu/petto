import React from 'react';
import { View, Text } from 'react-native';

import { formatCurrency } from '@/utils/formatters';
import { chartColors } from '@/utils/colors';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

interface ExpenseCategoryChartProps {
  data: CategoryData[];
}

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Food',
  vet_bills: 'Vet Bills',
  grooming: 'Grooming',
  accessories: 'Accessories',
  medication: 'Medication',
  insurance: 'Insurance',
  other: 'Other',
};

const ExpenseCategoryChart: React.FC<ExpenseCategoryChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <View className="py-4 items-center">
        <Text className="text-sm text-muted dark:text-muted-dark">
          No expenses this month
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {data.map((item, index) => {
        const barColor = chartColors[index % chartColors.length];
        const label = CATEGORY_LABELS[item.category] ?? item.category;

        return (
          <View key={item.category} className="gap-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-text-primary dark:text-text-dark">
                {label}
              </Text>
              <Text className="text-sm text-muted dark:text-muted-dark">
                {formatCurrency(item.amount)}
              </Text>
            </View>
            <View className="h-3 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden">
              <View
                style={{
                  width: `${Math.max(item.percentage, 2)}%`,
                  backgroundColor: barColor,
                }}
                className="h-full rounded-full"
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default React.memo(ExpenseCategoryChart);
