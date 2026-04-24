import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { UtensilsCrossed, Pill, Scale, Wallet } from 'lucide-react-native';
import { colors } from '@/utils/colors';

interface QuickActionsProps {
  onFeed: () => void;
  onMedication: () => void;
  onWeight: () => void;
  onExpense: () => void;
}

interface ActionCardProps {
  icon: React.ReactElement;
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
}

function ActionCard({ icon, label, onPress, accessibilityLabel }: ActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="flex-1 items-center justify-center rounded-2xl bg-white dark:bg-dark-card p-4 shadow-sm active:opacity-80"
    >
      <View className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mb-2">
        {icon}
      </View>
      <Text className="text-sm font-medium text-text-primary dark:text-text-dark text-center">
        {label}
      </Text>
    </Pressable>
  );
}

const QuickActions = React.memo(function QuickActions({
  onFeed,
  onMedication,
  onWeight,
  onExpense,
}: QuickActionsProps) {
  const handleFeed = useCallback(() => onFeed(), [onFeed]);
  const handleMedication = useCallback(() => onMedication(), [onMedication]);
  const handleWeight = useCallback(() => onWeight(), [onWeight]);
  const handleExpense = useCallback(() => onExpense(), [onExpense]);

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <ActionCard
          icon={<UtensilsCrossed size={24} color={colors.primary[500]} />}
          label="Feed"
          onPress={handleFeed}
          accessibilityLabel="Add feeding entry"
        />
        <ActionCard
          icon={<Pill size={24} color={colors.accent[500]} />}
          label="Medication"
          onPress={handleMedication}
          accessibilityLabel="Add medication entry"
        />
      </View>
      <View className="flex-row gap-3">
        <ActionCard
          icon={<Scale size={24} color={colors.info} />}
          label="Weight"
          onPress={handleWeight}
          accessibilityLabel="Add weight entry"
        />
        <ActionCard
          icon={<Wallet size={24} color={colors.warning} />}
          label="Expense"
          onPress={handleExpense}
          accessibilityLabel="Add expense entry"
        />
      </View>
    </View>
  );
});

export default QuickActions;
