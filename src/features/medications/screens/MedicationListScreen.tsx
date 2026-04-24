import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus, Pill } from 'lucide-react-native';
import { FAB, EmptyState } from '@/components/ui';
import { PetAvatar } from '@/components/shared';
import { usePets } from '@/hooks/usePets';
import { useMedications } from '@/hooks/useMedications';
import { isPast, isToday } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { HealthStackParamList } from '@/app/navigation/types';
import type { Medication, MedicationLog } from '@/utils/types';
import MedicationCard from '../components/MedicationCard';

type Props = NativeStackScreenProps<HealthStackParamList, 'MedicationList'>;

type TodayStatus = 'given' | 'pending' | 'overdue' | null;

function getTodayStatus(
  medication: Medication,
  todaysLogs: MedicationLog[],
): TodayStatus {
  // Find any log for this medication today
  const todayLog = todaysLogs.find(
    (log) => log.medicationId === medication.id && isToday(log.createdAt),
  );

  if (todayLog) {
    return todayLog.status === 'given' ? 'given' : todayLog.status === 'skipped' ? 'given' : 'pending';
  }

  // Check if any scheduled time has passed today
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  // If there are time-of-day entries, check if any are overdue
  if (medication.timeOfDay.length > 0) {
    const hasOverdueTime = medication.timeOfDay.some((timeStr) => {
      // Parse time like "8:00 AM" or "8:00 PM"
      const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return false;

      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();

      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      return currentHours > hours || (currentHours === hours && currentMinutes > minutes);
    });

    if (hasOverdueTime) return 'overdue';
    return 'pending';
  }

  // No time-of-day specified, check if start date is today or past
  if (medication.isActive) {
    if (isPast(medication.startDate) || isToday(medication.startDate)) {
      return 'pending';
    }
  }

  return null;
}

export default function MedicationListScreen({ navigation }: Props) {
  const { pets, selectedPetId, selectPet } = usePets();
  const {
    medications,
    medicationLogs,
    isLoading,
    loadActiveMedications,
    loadTodaysLogs,
    logDose,
  } = useMedications();

  const [refreshing, setRefreshing] = useState(false);

  const currentPetId = selectedPetId ?? pets[0]?.id ?? null;

  const loadData = useCallback(() => {
    if (currentPetId) {
      loadActiveMedications(currentPetId);
      loadTodaysLogs(currentPetId);
    }
  }, [currentPetId, loadActiveMedications, loadTodaysLogs]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleSelectPet = useCallback(
    (petId: string) => {
      selectPet(petId);
    },
    [selectPet],
  );

  const handleAddMedication = useCallback(() => {
    navigation.navigate('AddMedication', { petId: currentPetId ?? undefined });
  }, [navigation, currentPetId]);

  const handleGive = useCallback(
    (medication: Medication) => {
      if (currentPetId) {
        logDose(medication.id, currentPetId, 'given');
      }
    },
    [logDose, currentPetId],
  );

  const handleSkip = useCallback(
    (medication: Medication) => {
      if (currentPetId) {
        logDose(medication.id, currentPetId, 'skipped');
      }
    },
    [logDose, currentPetId],
  );

  const handlePressMedication = useCallback(
    (_medication: Medication) => {
      // Could navigate to detail/edit screen in the future
    },
    [],
  );

  // Split medications into today's schedule and active list
  const { todaySchedule, activeMedications } = useMemo(() => {
    const today: Array<{ medication: Medication; status: TodayStatus }> = [];
    const active: Medication[] = [];

    medications.forEach((med) => {
      if (!med.isActive) return;

      const status = getTodayStatus(med, medicationLogs);
      if (status !== null) {
        today.push({ medication: med, status });
      }
      active.push(med);
    });

    return { todaySchedule: today, activeMedications: active };
  }, [medications, medicationLogs]);

  const renderPetSelector = useCallback(
    () => (
      <View className="px-4 pt-4 pb-2">
        <FlatList
          horizontal
          data={pets}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3"
          renderItem={({ item }) => {
            const isSelected = item.id === currentPetId;
            return (
              <Pressable
                onPress={() => handleSelectPet(item.id)}
                accessibilityLabel={`Select ${item.name}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={`items-center px-2 py-1.5 rounded-xl ${
                  isSelected
                    ? 'bg-primary-100 dark:bg-primary-900'
                    : 'bg-white dark:bg-dark-card'
                }`}
              >
                <PetAvatar
                  photoUri={item.photoUri}
                  petType={item.petType}
                  name={item.name}
                  size="sm"
                />
                <Text
                  className={`text-xs mt-1 ${
                    isSelected
                      ? 'font-semibold text-primary-600 dark:text-primary-300'
                      : 'text-text-secondary dark:text-text-muted'
                  }`}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    ),
    [pets, currentPetId, handleSelectPet],
  );

  const renderTodaySchedule = useCallback(
    () => {
      if (todaySchedule.length === 0) return null;

      return (
        <View className="px-4 pt-2 pb-1">
          <Text className="text-lg font-bold text-text-primary dark:text-text-dark mb-3">
            Today's Schedule
          </Text>
          <View className="gap-3">
            {todaySchedule.map(({ medication, status }) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                todayStatus={status}
                onGive={handleGive}
                onSkip={handleSkip}
                onPress={handlePressMedication}
              />
            ))}
          </View>
        </View>
      );
    },
    [todaySchedule, handleGive, handleSkip, handlePressMedication],
  );

  const renderActiveMedicationsHeader = useCallback(
    () => (
      <View className="px-4 pt-4 pb-2">
        <Text className="text-lg font-bold text-text-primary dark:text-text-dark">
          Active Medications
        </Text>
      </View>
    ),
    [],
  );

  const renderMedicationItem = useCallback(
    ({ item }: { item: Medication }) => {
      const status = getTodayStatus(item, medicationLogs);
      return (
        <View className="px-4 mb-3">
          <MedicationCard
            medication={item}
            todayStatus={status}
            onGive={handleGive}
            onSkip={handleSkip}
            onPress={handlePressMedication}
          />
        </View>
      );
    },
    [medicationLogs, handleGive, handleSkip, handlePressMedication],
  );

  const renderEmptyState = useCallback(
    () => (
      <EmptyState
        icon={<Pill size={48} color={colors.muted} />}
        title="No Medications"
        subtitle="Track your pet's medications, dewormers, and supplements."
        actionLabel="Add Medication"
        onAction={handleAddMedication}
      />
    ),
    [handleAddMedication],
  );

  const keyExtractor = useCallback((item: Medication) => item.id, []);

  return (
    <View className="flex-1 bg-cream dark:bg-dark-bg">
      {renderPetSelector()}

      <FlatList
        data={activeMedications}
        keyExtractor={keyExtractor}
        renderItem={renderMedicationItem}
        ListHeaderComponent={
          <>
            {renderTodaySchedule()}
            {activeMedications.length > 0 && renderActiveMedicationsHeader()}
          </>
        }
        ListEmptyComponent={isLoading ? null : renderEmptyState()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-24"
      />

      <FAB
        icon={<Plus size={24} color="#FFFFFF" />}
        onPress={handleAddMedication}
        accessibilityLabel="Add medication"
      />
    </View>
  );
}
