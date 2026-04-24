import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check, Clock, AlertTriangle, Pill } from 'lucide-react-native';
import { Card, Badge, Button } from '@/components/ui';
import { colors } from '@/utils/colors';
import type { Medication, MedicationFrequency } from '@/utils/types';

type TodayStatus = 'given' | 'pending' | 'overdue' | null;

interface MedicationCardProps {
  medication: Medication;
  todayStatus: TodayStatus;
  onGive: (medication: Medication) => void;
  onSkip: (medication: Medication) => void;
  onPress: (medication: Medication) => void;
}

const FREQUENCY_LABELS: Record<MedicationFrequency, string> = {
  daily: 'Daily',
  twice_daily: 'Twice Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  custom: 'Custom',
};

function getStatusIndicator(status: TodayStatus) {
  switch (status) {
    case 'given':
      return {
        bgClass: 'bg-green-100 dark:bg-green-900',
        dotClass: 'bg-green-500',
        icon: <Check size={14} color={colors.success} />,
        label: 'Given',
      };
    case 'pending':
      return {
        bgClass: 'bg-yellow-100 dark:bg-yellow-900',
        dotClass: 'bg-yellow-500',
        icon: <Clock size={14} color={colors.warning} />,
        label: 'Pending',
      };
    case 'overdue':
      return {
        bgClass: 'bg-red-100 dark:bg-red-900',
        dotClass: 'bg-red-500',
        icon: <AlertTriangle size={14} color={colors.danger} />,
        label: 'Overdue',
      };
    default:
      return null;
  }
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  todayStatus,
  onGive,
  onSkip,
  onPress,
}) => {
  const handlePress = useCallback(() => {
    onPress(medication);
  }, [onPress, medication]);

  const handleGive = useCallback(() => {
    onGive(medication);
  }, [onGive, medication]);

  const handleSkip = useCallback(() => {
    onSkip(medication);
  }, [onSkip, medication]);

  const statusInfo = getStatusIndicator(todayStatus);

  const frequencyLabel =
    medication.frequency === 'custom' && medication.customFrequencyDays
      ? `Every ${medication.customFrequencyDays} days`
      : FREQUENCY_LABELS[medication.frequency];

  const cardBgClass =
    todayStatus === 'given'
      ? 'bg-green-50 dark:bg-green-950'
      : todayStatus === 'overdue'
        ? 'bg-red-50 dark:bg-red-950'
        : todayStatus === 'pending'
          ? 'bg-yellow-50 dark:bg-yellow-950'
          : '';

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={`${medication.name} medication card`}
      accessibilityRole="button"
    >
      <Card className={cardBgClass}>
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-3">
              <Pill size={20} color={colors.primary[500]} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-semibold text-text-primary dark:text-text-dark">
                  {medication.name}
                </Text>
                {medication.isDeworming && (
                  <Badge label="Deworming" variant="accent" size="sm" />
                )}
              </View>
              {medication.dosage && (
                <Text className="text-sm text-text-secondary dark:text-text-muted mt-0.5">
                  {medication.dosage}
                </Text>
              )}
              <View className="flex-row items-center gap-2 mt-1">
                <Badge label={frequencyLabel} variant="primary" size="sm" />
                {medication.timeOfDay.length > 0 && (
                  <Text className="text-xs text-text-secondary dark:text-text-muted">
                    {medication.timeOfDay.join(', ')}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {statusInfo && (
            <View className={`flex-row items-center rounded-full px-2.5 py-1 ${statusInfo.bgClass}`}>
              {statusInfo.icon}
              <Text className="text-xs font-medium ml-1 text-text-primary dark:text-text-dark">
                {statusInfo.label}
              </Text>
            </View>
          )}
        </View>

        {(todayStatus === 'pending' || todayStatus === 'overdue') && (
          <View className="flex-row gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <View className="flex-1">
              <Button
                variant="primary"
                size="sm"
                onPress={handleGive}
                accessibilityLabel={`Give ${medication.name}`}
                leftIcon={<Check size={16} color="#FFFFFF" />}
              >
                Give
              </Button>
            </View>
            <View className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                onPress={handleSkip}
                accessibilityLabel={`Skip ${medication.name}`}
              >
                Skip
              </Button>
            </View>
          </View>
        )}

        {todayStatus === 'given' && (
          <View className="flex-row items-center mt-3 pt-3 border-t border-green-100 dark:border-green-800">
            <Check size={18} color={colors.success} />
            <Text className="text-sm font-medium text-green-600 dark:text-green-400 ml-1.5">
              Administered today
            </Text>
          </View>
        )}
      </Card>
    </Pressable>
  );
};

export default React.memo(MedicationCard);
