import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Scale, ArrowUp, ArrowDown, Minus } from 'lucide-react-native';

import { usePets } from '@/hooks/usePets';
import { useWeights } from '@/hooks/useWeights';
import { PetAvatar } from '@/components/shared';
import { Card, EmptyState, FAB } from '@/components/ui';
import WeightChart from '@/features/weight/components/WeightChart';
import { formatDate, formatWeight } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { HealthStackParamList } from '@/app/navigation/types';
import type { WeightEntry } from '@/utils/types';

type Period = '1M' | '3M' | '6M' | '1Y' | 'all';
const PERIODS: Period[] = ['1M', '3M', '6M', '1Y', 'all'];

type NavigationProp = NativeStackNavigationProp<HealthStackParamList, 'WeightHistory'>;

interface EntryWithDelta extends WeightEntry {
  delta: number | null;
}

export default function WeightHistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { pets, selectedPetId, selectPet } = usePets();
  const { entries, loadEntries } = useWeights();
  const [period, setPeriod] = useState<Period>('3M');
  const [refreshing, setRefreshing] = useState(false);

  const activePetId = selectedPetId ?? pets[0]?.id ?? null;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activePetId) {
      await loadEntries(activePetId);
    }
    setRefreshing(false);
  }, [activePetId, loadEntries]);

  useFocusEffect(
    useCallback(() => {
      if (activePetId) {
        loadEntries(activePetId);
      }
    }, [activePetId, loadEntries]),
  );

  const handleSelectPet = useCallback(
    (petId: string) => {
      selectPet(petId);
    },
    [selectPet],
  );

  const handleAddWeight = useCallback(() => {
    navigation.navigate('AddWeight', { petId: activePetId ?? undefined });
  }, [navigation, activePetId]);

  const handleSelectPeriod = useCallback((p: Period) => {
    setPeriod(p);
  }, []);

  const entriesWithDelta: EntryWithDelta[] = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime(),
    );
    return sorted.map((entry, index) => {
      const nextEntry = index < sorted.length - 1 ? sorted[index + 1] : null;
      const delta = nextEntry ? entry.weight - nextEntry.weight : null;
      return { ...entry, delta };
    });
  }, [entries]);

  const renderPetAvatar = useCallback(
    ({ item }: { item: (typeof pets)[number] }) => {
      const isSelected = item.id === activePetId;
      return (
        <Pressable
          onPress={() => handleSelectPet(item.id)}
          accessibilityLabel={`Select ${item.name}`}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
          className={`items-center mr-3 px-2 py-1.5 rounded-xl ${
            isSelected ? 'bg-primary-100 dark:bg-primary-900' : ''
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
                ? 'font-semibold text-primary-500 dark:text-primary-300'
                : 'text-muted dark:text-muted-dark'
            }`}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </Pressable>
      );
    },
    [activePetId, handleSelectPet],
  );

  const renderWeightEntry = useCallback(
    ({ item }: { item: EntryWithDelta }) => {
      const deltaColor =
        item.delta !== null && item.delta > 0
          ? colors.success
          : item.delta !== null && item.delta < 0
            ? colors.danger
            : colors.muted;

      const DeltaIcon =
        item.delta !== null && item.delta > 0
          ? ArrowUp
          : item.delta !== null && item.delta < 0
            ? ArrowDown
            : Minus;

      return (
        <Card className="mb-2 mx-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-base font-semibold text-text-primary dark:text-text-dark">
                {formatWeight(item.weight, item.unit)}
              </Text>
              <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
                {formatDate(item.measuredAt)}
              </Text>
              {item.notes ? (
                <Text
                  className="text-xs text-muted dark:text-muted-dark mt-1"
                  numberOfLines={1}
                >
                  {item.notes}
                </Text>
              ) : null}
            </View>

            {item.delta !== null ? (
              <View className="flex-row items-center">
                <DeltaIcon size={14} color={deltaColor} />
                <Text
                  style={{ color: deltaColor }}
                  className="text-sm font-medium ml-0.5"
                >
                  {Math.abs(item.delta).toFixed(1)} {item.unit}
                </Text>
              </View>
            ) : null}
          </View>
        </Card>
      );
    },
    [],
  );

  const keyExtractor = useCallback((item: EntryWithDelta) => item.id, []);

  const ListHeader = useMemo(
    () => (
      <View className="px-4">
        {/* Chart Section */}
        <Card className="mb-4">
          {/* Period Tabs */}
          <View className="flex-row mb-3">
            {PERIODS.map((p) => (
              <Pressable
                key={p}
                onPress={() => handleSelectPeriod(p)}
                accessibilityLabel={`Show ${p} period`}
                accessibilityRole="button"
                accessibilityState={{ selected: p === period }}
                className={`flex-1 py-2 items-center rounded-lg mx-0.5 ${
                  p === period
                    ? 'bg-primary-500 dark:bg-primary-400'
                    : 'bg-gray-100 dark:bg-dark-surface'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    p === period
                      ? 'text-white'
                      : 'text-muted dark:text-muted-dark'
                  }`}
                >
                  {p === 'all' ? 'All' : p}
                </Text>
              </Pressable>
            ))}
          </View>

          <WeightChart entries={entries} period={period} />
        </Card>

        <Text className="text-base font-semibold text-text-primary dark:text-text-dark mb-2">
          History
        </Text>
      </View>
    ),
    [entries, period, handleSelectPeriod],
  );

  const ListEmpty = useMemo(
    () => (
      <EmptyState
        icon={<Scale size={48} color={colors.muted} />}
        title="No Weight Entries"
        subtitle="Start tracking your pet's weight to see trends over time."
        actionLabel="Add Weight"
        onAction={handleAddWeight}
      />
    ),
    [handleAddWeight],
  );

  return (
    <View className="flex-1 bg-cream dark:bg-dark-bg">
      {/* Header */}
      <View className="px-4 pt-14 pb-3 bg-white dark:bg-dark-card">
        <Text className="text-xl font-bold text-text-primary dark:text-text-dark mb-3">
          Weight Tracker
        </Text>

        {/* Pet Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-1"
        >
          {pets.map((pet) => (
            <View key={pet.id}>
              {renderPetAvatar({ item: pet })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Weight List */}
      <FlatList
        data={entriesWithDelta}
        renderItem={renderWeightEntry}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListHeaderComponentStyle={{ paddingTop: 16 }}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* FAB */}
      <FAB
        icon={<Plus size={24} color="#FFFFFF" />}
        onPress={handleAddWeight}
        accessibilityLabel="Add weight entry"
      />
    </View>
  );
}
