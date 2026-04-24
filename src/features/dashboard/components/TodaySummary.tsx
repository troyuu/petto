import React from 'react';
import { View, Text } from 'react-native';
import { UtensilsCrossed, Pill, Wallet } from 'lucide-react-native';
import { formatCurrency } from '@/utils/formatters';
import { colors } from '@/utils/colors';

interface TodaySummaryProps {
  feedingCount: number;
  medsGiven: number;
  medsDue: number;
  todaySpending: number;
}

interface StatCardProps {
  icon: React.ReactElement;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View className="flex-1 items-center rounded-2xl bg-white dark:bg-dark-card p-3 shadow-sm">
      <View className="mb-1.5">{icon}</View>
      <Text
        className="text-base font-bold text-text-primary dark:text-text-dark"
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text
        className="text-xs text-muted dark:text-muted-dark mt-0.5 text-center"
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const TodaySummary = React.memo(function TodaySummary({
  feedingCount,
  medsGiven,
  medsDue,
  todaySpending,
}: TodaySummaryProps) {
  return (
    <View className="flex-row gap-3">
      <StatCard
        icon={<UtensilsCrossed size={20} color={colors.primary[500]} />}
        label="Feedings"
        value={`${feedingCount}x`}
      />
      <StatCard
        icon={<Pill size={20} color={colors.accent[500]} />}
        label="Meds"
        value={`${medsGiven}/${medsGiven + medsDue}`}
      />
      <StatCard
        icon={<Wallet size={20} color={colors.warning} />}
        label="Spent"
        value={formatCurrency(todaySpending)}
      />
    </View>
  );
});

export default TodaySummary;
