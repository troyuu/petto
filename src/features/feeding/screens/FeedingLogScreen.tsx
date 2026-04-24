import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, UtensilsCrossed } from 'lucide-react-native';
import dayjs from 'dayjs';
import type { HealthStackParamList } from '@/app/navigation/types';
import type { Feeding, Pet } from '@/utils/types';
import { usePets } from '@/hooks/usePets';
import { useFeedings } from '@/hooks/useFeedings';
import { formatDate } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import { FAB, EmptyState } from '@/components/ui';
import { PetAvatar } from '@/components/shared';
import FeedingEntryCard from '@/features/feeding/components/FeedingEntryCard';

type FeedingLogNavProp = NativeStackNavigationProp<HealthStackParamList, 'FeedingLog'>;

type DateFilter = 'today' | 'week' | 'month' | 'all';

interface FeedingSection {
  title: string;
  data: Feeding[];
}

function groupFeedingsByDay(feedings: Feeding[]): FeedingSection[] {
  const groups = new Map<string, Feeding[]>();

  for (const feeding of feedings) {
    const dateKey = dayjs(feeding.fedAt).format('YYYY-MM-DD');
    const existing = groups.get(dateKey);
    if (existing) {
      existing.push(feeding);
    } else {
      groups.set(dateKey, [feeding]);
    }
  }

  const sections: FeedingSection[] = [];
  for (const [dateKey, data] of groups) {
    const isToday = dayjs(dateKey).isSame(dayjs(), 'day');
    const isYesterday = dayjs(dateKey).isSame(dayjs().subtract(1, 'day'), 'day');
    let title: string;

    if (isToday) {
      title = 'Today';
    } else if (isYesterday) {
      title = 'Yesterday';
    } else {
      title = formatDate(dateKey, 'ddd, MMM D');
    }

    sections.push({ title, data });
  }

  return sections;
}

function filterFeedingsByDate(
  feedings: Feeding[],
  filter: DateFilter,
): Feeding[] {
  const now = dayjs();

  switch (filter) {
    case 'today':
      return feedings.filter((f) => dayjs(f.fedAt).isSame(now, 'day'));
    case 'week':
      return feedings.filter((f) =>
        dayjs(f.fedAt).isAfter(now.subtract(7, 'day')),
      );
    case 'month':
      return feedings.filter((f) =>
        dayjs(f.fedAt).isAfter(now.subtract(30, 'day')),
      );
    case 'all':
      return feedings;
  }
}

const DATE_FILTERS: { label: string; value: DateFilter }[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'All', value: 'all' },
];

export default function FeedingLogScreen() {
  const navigation = useNavigation<FeedingLogNavProp>();
  const { pets } = usePets();
  const { feedings, loadFeedings, deleteFeeding } = useFeedings();
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [refreshing, setRefreshing] = useState(false);

  const activePetId = selectedPetId ?? (pets.length > 0 ? pets[0].id : null);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activePetId) {
      await loadFeedings(activePetId);
    }
    setRefreshing(false);
  }, [activePetId, loadFeedings]);

  useFocusEffect(
    useCallback(() => {
      if (activePetId) {
        loadFeedings(activePetId);
      }
    }, [activePetId, loadFeedings]),
  );

  const filteredFeedings = useMemo(() => {
    return filterFeedingsByDate(feedings, dateFilter);
  }, [feedings, dateFilter]);

  const sections = useMemo(() => {
    return groupFeedingsByDay(filteredFeedings);
  }, [filteredFeedings]);

  // Flatten sections for FlatList with section headers
  const flatData = useMemo(() => {
    const items: Array<
      | { type: 'header'; title: string; key: string }
      | { type: 'item'; feeding: Feeding; key: string }
    > = [];

    for (const section of sections) {
      items.push({
        type: 'header',
        title: section.title,
        key: `header-${section.title}`,
      });
      for (const feeding of section.data) {
        items.push({
          type: 'item',
          feeding,
          key: feeding.id,
        });
      }
    }

    return items;
  }, [sections]);

  const handleSelectPet = useCallback((pet: Pet) => {
    setSelectedPetId(pet.id);
  }, []);

  const handleAddFeeding = useCallback(() => {
    navigation.navigate('AddFeeding', {
      petId: activePetId ?? undefined,
    });
  }, [navigation, activePetId]);

  const handleEditFeeding = useCallback(
    (feeding: Feeding) => {
      navigation.navigate('AddFeeding', {
        petId: feeding.petId,
      });
    },
    [navigation],
  );

  const handleDeleteFeeding = useCallback(
    (feeding: Feeding) => {
      Alert.alert(
        'Delete Feeding',
        'Are you sure you want to delete this feeding entry?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteFeeding(feeding.id);
            },
          },
        ],
      );
    },
    [deleteFeeding],
  );

  const handleSelectDateFilter = useCallback((filter: DateFilter) => {
    setDateFilter(filter);
  }, []);

  const keyExtractor = useCallback(
    (item: (typeof flatData)[number]) => item.key,
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof flatData)[number] }) => {
      if (item.type === 'header') {
        return (
          <View className="px-5 pt-4 pb-2">
            <Text className="text-sm font-semibold text-muted dark:text-muted-dark uppercase">
              {item.title}
            </Text>
          </View>
        );
      }

      return (
        <View className="px-5">
          <FeedingEntryCard
            feeding={item.feeding}
            onEdit={() => handleEditFeeding(item.feeding)}
            onDelete={() => handleDeleteFeeding(item.feeding)}
          />
        </View>
      );
    },
    [handleEditFeeding, handleDeleteFeeding],
  );

  const renderEmpty = useCallback(
    () => (
      <EmptyState
        icon={<UtensilsCrossed size={48} color={colors.muted} />}
        title="No feedings recorded yet"
        subtitle="Tap the + button to log your pet's first meal"
        actionLabel="Add Feeding"
        onAction={handleAddFeeding}
      />
    ),
    [handleAddFeeding],
  );

  return (
    <View className="flex-1 bg-cream dark:bg-dark-bg">
      {/* Header */}
      <View className="px-5 pt-14 pb-2">
        <Text className="text-xl font-bold text-text-primary dark:text-text-dark">
          Feeding Log
        </Text>
      </View>

      {/* Pet Selector */}
      {pets.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5 py-2"
          style={{ flexGrow: 0 }}
        >
          {pets.map((pet) => {
            const isSelected = pet.id === (selectedPetId ?? pets[0]?.id);
            return (
              <Pressable
                key={pet.id}
                onPress={() => handleSelectPet(pet)}
                accessibilityLabel={`Filter by ${pet.name}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={`flex-row items-center mr-2 rounded-full px-3 py-1.5 ${
                  isSelected
                    ? 'bg-primary-500 dark:bg-primary-400'
                    : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700'
                }`}
              >
                <PetAvatar
                  photoUri={pet.photoUri}
                  petType={pet.petType}
                  name={pet.name}
                  size="sm"
                  className="mr-1.5"
                />
                <Text
                  className={`text-sm font-medium ${
                    isSelected
                      ? 'text-white'
                      : 'text-text-primary dark:text-text-dark'
                  }`}
                >
                  {pet.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* Date Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 py-2"
        style={{ flexGrow: 0 }}
      >
        {DATE_FILTERS.map((filter) => {
          const isActive = filter.value === dateFilter;
          return (
            <Pressable
              key={filter.value}
              onPress={() => handleSelectDateFilter(filter.value)}
              accessibilityLabel={`Filter by ${filter.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              className={`mr-2 rounded-full px-4 py-1.5 ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900'
                  : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-300'
                    : 'text-muted dark:text-muted-dark'
                }`}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Feeding List */}
      <FlatList
        data={flatData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* FAB */}
      <FAB
        icon={<Plus size={24} color="#FFFFFF" />}
        onPress={handleAddFeeding}
        accessibilityLabel="Add new feeding"
      />
    </View>
  );
}
