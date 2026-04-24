import React, { useCallback, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Stethoscope,
  Syringe,
  AlertCircle,
  Scissors as ScissorsIcon,
  HeartPulse,
  MoreHorizontal,
} from 'lucide-react-native';
import { Card, Badge } from '@/components/ui';
import { formatDate, formatCurrency, daysUntil, isToday } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { VetVisit, VetVisitPurpose } from '@/utils/types';

interface VetVisitCardProps {
  visit: VetVisit;
  onPress: (visit: VetVisit) => void;
  onDelete: (visit: VetVisit) => void;
}

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger';

const PURPOSE_CONFIG: Record<VetVisitPurpose, {
  label: string;
  variant: BadgeVariant;
  iconColor: string;
}> = {
  checkup: { label: 'Checkup', variant: 'primary', iconColor: colors.primary[500] },
  vaccination: { label: 'Vaccination', variant: 'success', iconColor: colors.success },
  emergency: { label: 'Emergency', variant: 'danger', iconColor: colors.danger },
  surgery: { label: 'Surgery', variant: 'warning', iconColor: colors.warning },
  grooming: { label: 'Grooming', variant: 'accent', iconColor: colors.accent[500] },
  other: { label: 'Other', variant: 'default', iconColor: colors.muted },
};

function getPurposeIcon(purpose: VetVisitPurpose, iconColor: string) {
  const size = 20;
  switch (purpose) {
    case 'checkup':
      return <Stethoscope size={size} color={iconColor} />;
    case 'vaccination':
      return <Syringe size={size} color={iconColor} />;
    case 'emergency':
      return <AlertCircle size={size} color={iconColor} />;
    case 'surgery':
      return <HeartPulse size={size} color={iconColor} />;
    case 'grooming':
      return <ScissorsIcon size={size} color={iconColor} />;
    case 'other':
      return <MoreHorizontal size={size} color={iconColor} />;
  }
}

function getTimeLabel(visitDate: string): string | null {
  if (isToday(visitDate)) {
    return 'Today';
  }

  const days = daysUntil(visitDate);

  if (days < 0) {
    return null; // past visit
  }

  if (days === 1) {
    return 'Tomorrow';
  }

  return `In ${days} days`;
}

const VetVisitCard: React.FC<VetVisitCardProps> = ({ visit, onPress, onDelete: _onDelete }) => {
  const handlePress = useCallback(() => {
    onPress(visit);
  }, [onPress, visit]);

  const config = PURPOSE_CONFIG[visit.purpose];
  const timeLabel = useMemo(() => getTimeLabel(visit.visitDate), [visit.visitDate]);
  const isUpcoming = daysUntil(visit.visitDate) >= 0;

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={`${config.label} vet visit on ${formatDate(visit.visitDate)}`}
      accessibilityRole="button"
    >
      <Card>
        <View className="flex-row items-start">
          <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-3">
            {getPurposeIcon(visit.purpose, config.iconColor)}
          </View>

          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Badge label={config.label} variant={config.variant} size="sm" />
              {isUpcoming && timeLabel && (
                <Badge
                  label={timeLabel}
                  variant={timeLabel === 'Today' ? 'warning' : 'primary'}
                  size="sm"
                />
              )}
            </View>

            {visit.clinicName && (
              <Text className="text-base font-semibold text-text-primary dark:text-text-dark mt-1.5">
                {visit.clinicName}
              </Text>
            )}

            {visit.vetName && (
              <Text className="text-sm text-text-secondary dark:text-text-muted mt-0.5">
                Dr. {visit.vetName}
              </Text>
            )}

            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-sm text-text-secondary dark:text-text-muted">
                {formatDate(visit.visitDate)}
              </Text>

              {visit.cost !== null && visit.cost > 0 && (
                <Text className="text-sm font-semibold text-primary-600 dark:text-primary-300">
                  {formatCurrency(visit.cost)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

export default React.memo(VetVisitCard);
