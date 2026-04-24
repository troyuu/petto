import React from 'react';
import { Text, View } from 'react-native';
import { Syringe, Calendar } from 'lucide-react-native';
import { Card, Badge } from '@/components/ui';
import { formatDate } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { Vaccination } from '@/utils/types';

type VaccinationStatus = 'current' | 'due_soon' | 'overdue';

interface VaccineCardProps {
  vaccination: Vaccination;
  status: VaccinationStatus;
}

const STATUS_CONFIG: Record<VaccinationStatus, {
  borderClass: string;
  badgeLabel: string;
  badgeVariant: 'success' | 'warning' | 'danger';
  iconColor: string;
}> = {
  current: {
    borderClass: 'border-l-4 border-l-green-500',
    badgeLabel: 'Current',
    badgeVariant: 'success',
    iconColor: colors.success,
  },
  due_soon: {
    borderClass: 'border-l-4 border-l-yellow-500',
    badgeLabel: 'Due Soon',
    badgeVariant: 'warning',
    iconColor: colors.warning,
  },
  overdue: {
    borderClass: 'border-l-4 border-l-red-500',
    badgeLabel: 'Overdue',
    badgeVariant: 'danger',
    iconColor: colors.danger,
  },
};

const VaccineCard: React.FC<VaccineCardProps> = ({ vaccination, status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <Card className={config.borderClass}>
      <View className="flex-row items-start">
        <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-3">
          <Syringe size={20} color={config.iconColor} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-text-primary dark:text-text-dark flex-1 mr-2">
              {vaccination.name}
            </Text>
            <Badge label={config.badgeLabel} variant={config.badgeVariant} size="sm" />
          </View>

          <View className="flex-row items-center mt-2 gap-1.5">
            <Calendar size={14} color={colors.muted} />
            <Text className="text-sm text-text-secondary dark:text-text-muted">
              Administered: {formatDate(vaccination.dateAdministered)}
            </Text>
          </View>

          {vaccination.batchNumber && (
            <Text className="text-xs text-text-secondary dark:text-text-muted mt-1">
              Batch: {vaccination.batchNumber}
            </Text>
          )}

          {vaccination.nextDueDate && (
            <View className="flex-row items-center mt-1.5 gap-1.5">
              <Calendar size={14} color={config.iconColor} />
              <Text
                className={`text-sm font-medium ${
                  status === 'overdue'
                    ? 'text-red-600 dark:text-red-400'
                    : status === 'due_soon'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-green-600 dark:text-green-400'
                }`}
              >
                Next due: {formatDate(vaccination.nextDueDate)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

export default React.memo(VaccineCard);
