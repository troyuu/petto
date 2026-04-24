import React from 'react';
import { View, Text } from 'react-native';
import { Wallet } from 'lucide-react-native';

import { Card } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import { colors } from '@/utils/colors';

interface ExpenseSummaryCardProps {
  totalAmount: number;
  month: string;
  currency: string;
}

const ExpenseSummaryCard: React.FC<ExpenseSummaryCardProps> = ({
  totalAmount,
  month,
  currency,
}) => {
  return (
    <Card className="mb-4">
      <View className="items-center py-2">
        <View className="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900 items-center justify-center mb-2">
          <Wallet size={24} color={colors.accent[500]} />
        </View>
        <Text className="text-sm text-muted dark:text-muted-dark mb-1">
          Total Spending - {month}
        </Text>
        <Text className="text-3xl font-bold text-text-primary dark:text-text-dark">
          {formatCurrency(totalAmount, currency)}
        </Text>
      </View>
    </Card>
  );
};

export default React.memo(ExpenseSummaryCard);
