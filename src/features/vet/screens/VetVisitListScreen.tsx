import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus, Stethoscope } from 'lucide-react-native';
import { FAB, EmptyState, ConfirmDialog, SwipeAction } from '@/components/ui';
import { PetAvatar } from '@/components/shared';
import { usePets } from '@/hooks/usePets';
import { useVetVisits } from '@/hooks/useVetVisits';
import { isFuture, isToday } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { HealthStackParamList } from '@/app/navigation/types';
import type { VetVisit } from '@/utils/types';
import VetVisitCard from '../components/VetVisitCard';

type Props = NativeStackScreenProps<HealthStackParamList, 'VetVisitList'>;

type TabType = 'upcoming' | 'past';

export default function VetVisitListScreen({ navigation }: Props) {
  const { pets, selectedPetId, selectPet } = usePets();
  const {
    vetVisits,
    isLoading,
    loadVetVisits,
    deleteVetVisit,
  } = useVetVisits();

  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VetVisit | null>(null);

  const currentPetId = selectedPetId ?? pets[0]?.id ?? null;

  const loadData = useCallback(() => {
    if (currentPetId) {
      loadVetVisits(currentPetId);
    }
  }, [currentPetId, loadVetVisits]);

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

  const handleAddVisit = useCallback(() => {
    navigation.navigate('AddVetVisit', { petId: currentPetId ?? undefined });
  }, [navigation, currentPetId]);

  const handlePressVisit = useCallback(
    (_visit: VetVisit) => {
      // Could navigate to detail/edit screen
    },
    [],
  );

  const handleDeletePress = useCallback((visit: VetVisit) => {
    setDeleteTarget(visit);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteVetVisit(deleteTarget.id);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteVetVisit]);

  const handleCancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  // Split visits into upcoming and past
  const { upcomingVisits, pastVisits } = useMemo(() => {
    const upcoming: VetVisit[] = [];
    const past: VetVisit[] = [];

    vetVisits.forEach((visit) => {
      if (isFuture(visit.visitDate) || isToday(visit.visitDate)) {
        upcoming.push(visit);
      } else {
        past.push(visit);
      }
    });

    // Sort upcoming by date ascending (nearest first)
    upcoming.sort(
      (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime(),
    );

    // Sort past by date descending (most recent first)
    past.sort(
      (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
    );

    return { upcomingVisits: upcoming, pastVisits: past };
  }, [vetVisits]);

  const displayedVisits = activeTab === 'upcoming' ? upcomingVisits : pastVisits;

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

  const renderTabs = useCallback(
    () => (
      <View className="flex-row mx-4 mt-3 mb-2 bg-gray-100 dark:bg-dark-surface rounded-xl p-1">
        <Pressable
          onPress={() => handleTabChange('upcoming')}
          accessibilityLabel="Show upcoming visits"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'upcoming' }}
          className={`flex-1 items-center py-2.5 rounded-lg ${
            activeTab === 'upcoming'
              ? 'bg-white dark:bg-dark-card shadow-sm'
              : ''
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === 'upcoming'
                ? 'text-primary-600 dark:text-primary-300'
                : 'text-text-secondary dark:text-text-muted'
            }`}
          >
            Upcoming
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleTabChange('past')}
          accessibilityLabel="Show past visits"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'past' }}
          className={`flex-1 items-center py-2.5 rounded-lg ${
            activeTab === 'past'
              ? 'bg-white dark:bg-dark-card shadow-sm'
              : ''
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === 'past'
                ? 'text-primary-600 dark:text-primary-300'
                : 'text-text-secondary dark:text-text-muted'
            }`}
          >
            Past
          </Text>
        </Pressable>
      </View>
    ),
    [activeTab, handleTabChange],
  );

  const renderVisitItem = useCallback(
    ({ item }: { item: VetVisit }) => (
      <View className="px-4 mb-3">
        <SwipeAction onDelete={() => handleDeletePress(item)}>
          <VetVisitCard
            visit={item}
            onPress={handlePressVisit}
            onDelete={handleDeletePress}
          />
        </SwipeAction>
      </View>
    ),
    [handlePressVisit, handleDeletePress],
  );

  const renderEmptyState = useCallback(
    () => (
      <EmptyState
        icon={<Stethoscope size={48} color={colors.muted} />}
        title={
          activeTab === 'upcoming'
            ? 'No Upcoming Visits'
            : 'No Past Visits'
        }
        subtitle={
          activeTab === 'upcoming'
            ? 'Schedule your pet\'s next vet appointment.'
            : 'Past vet visits will appear here.'
        }
        actionLabel={activeTab === 'upcoming' ? 'Schedule Visit' : undefined}
        onAction={activeTab === 'upcoming' ? handleAddVisit : undefined}
      />
    ),
    [activeTab, handleAddVisit],
  );

  const keyExtractor = useCallback((item: VetVisit) => item.id, []);

  return (
    <View className="flex-1 bg-cream dark:bg-dark-bg">
      {renderPetSelector()}
      {renderTabs()}

      <FlatList
        data={displayedVisits}
        keyExtractor={keyExtractor}
        renderItem={renderVisitItem}
        ListEmptyComponent={isLoading ? null : renderEmptyState()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pt-2 pb-24"
      />

      <FAB
        icon={<Plus size={24} color="#FFFFFF" />}
        onPress={handleAddVisit}
        accessibilityLabel="Add vet visit"
      />

      <ConfirmDialog
        visible={deleteTarget !== null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Vet Visit"
        message="Are you sure you want to delete this vet visit? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
      />
    </View>
  );
}
