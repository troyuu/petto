import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Syringe } from 'lucide-react-native';
import { EmptyState } from '@/components/ui';
import { PetAvatar } from '@/components/shared';
import { usePets } from '@/hooks/usePets';
import { useVetVisits } from '@/hooks/useVetVisits';
import { daysUntil, isPast } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { HealthStackParamList } from '@/app/navigation/types';
import type { Vaccination } from '@/utils/types';
import VaccineCard from '../components/VaccineCard';

type Props = NativeStackScreenProps<HealthStackParamList, 'VaccinationList'>;

type VaccinationStatus = 'current' | 'due_soon' | 'overdue';

function getVaccinationStatus(vaccination: Vaccination): VaccinationStatus {
  if (!vaccination.nextDueDate) {
    return 'current';
  }

  if (isPast(vaccination.nextDueDate)) {
    return 'overdue';
  }

  const daysRemaining = daysUntil(vaccination.nextDueDate);
  if (daysRemaining <= 30) {
    return 'due_soon';
  }

  return 'current';
}

export default function VaccinationScreen({ navigation: _navigation }: Props) {
  const { pets, selectedPetId, selectPet } = usePets();
  const { vaccinations, isLoading, loadVaccinations } = useVetVisits();

  const [refreshing, setRefreshing] = useState(false);

  const currentPetId = selectedPetId ?? pets[0]?.id ?? null;

  const loadData = useCallback(() => {
    if (currentPetId) {
      loadVaccinations(currentPetId);
    }
  }, [currentPetId, loadVaccinations]);

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

  // Annotate each vaccination with its status
  const annotatedVaccinations = useMemo(() => {
    return vaccinations.map((vacc) => ({
      vaccination: vacc,
      status: getVaccinationStatus(vacc),
    }));
  }, [vaccinations]);

  // Sort: overdue first, then due_soon, then current
  const sortedVaccinations = useMemo(() => {
    const statusOrder: Record<VaccinationStatus, number> = {
      overdue: 0,
      due_soon: 1,
      current: 2,
    };

    return [...annotatedVaccinations].sort(
      (a, b) => statusOrder[a.status] - statusOrder[b.status],
    );
  }, [annotatedVaccinations]);

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

  // Summary counts
  const { currentCount, dueSoonCount, overdueCount } = useMemo(() => {
    let current = 0;
    let dueSoon = 0;
    let overdue = 0;
    annotatedVaccinations.forEach(({ status }) => {
      if (status === 'current') current++;
      else if (status === 'due_soon') dueSoon++;
      else if (status === 'overdue') overdue++;
    });
    return { currentCount: current, dueSoonCount: dueSoon, overdueCount: overdue };
  }, [annotatedVaccinations]);

  const renderSummary = useCallback(
    () => {
      if (annotatedVaccinations.length === 0) return null;

      return (
        <View className="flex-row gap-3 px-4 pt-3 pb-1">
          <View className="flex-1 bg-green-50 dark:bg-green-950 rounded-xl p-3 items-center">
            <Text className="text-lg font-bold text-green-600 dark:text-green-400">
              {currentCount}
            </Text>
            <Text className="text-xs text-green-700 dark:text-green-300">Current</Text>
          </View>
          <View className="flex-1 bg-yellow-50 dark:bg-yellow-950 rounded-xl p-3 items-center">
            <Text className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {dueSoonCount}
            </Text>
            <Text className="text-xs text-yellow-700 dark:text-yellow-300">Due Soon</Text>
          </View>
          <View className="flex-1 bg-red-50 dark:bg-red-950 rounded-xl p-3 items-center">
            <Text className="text-lg font-bold text-red-600 dark:text-red-400">
              {overdueCount}
            </Text>
            <Text className="text-xs text-red-700 dark:text-red-300">Overdue</Text>
          </View>
        </View>
      );
    },
    [annotatedVaccinations.length, currentCount, dueSoonCount, overdueCount],
  );

  const renderVaccineItem = useCallback(
    ({ item }: { item: { vaccination: Vaccination; status: VaccinationStatus } }) => (
      <View className="px-4 mb-3">
        <VaccineCard
          vaccination={item.vaccination}
          status={item.status}
        />
      </View>
    ),
    [],
  );

  const renderEmptyState = useCallback(
    () => (
      <EmptyState
        icon={<Syringe size={48} color={colors.muted} />}
        title="No Vaccinations"
        subtitle="Vaccination records from vet visits will appear here."
      />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: { vaccination: Vaccination; status: VaccinationStatus }) => item.vaccination.id,
    [],
  );

  return (
    <View className="flex-1 bg-cream dark:bg-dark-bg">
      {renderPetSelector()}

      <FlatList
        data={sortedVaccinations}
        keyExtractor={keyExtractor}
        renderItem={renderVaccineItem}
        ListHeaderComponent={renderSummary()}
        ListEmptyComponent={isLoading ? null : renderEmptyState()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
      />
    </View>
  );
}
