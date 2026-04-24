import React, { useCallback, useState, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PawPrint, Plus } from 'lucide-react-native';
import type { PetStackParamList } from '@/app/navigation/types';
import type { Pet } from '@/utils/types';
import { usePets } from '@/hooks/usePets';
import { SearchBar, FAB, EmptyState, ConfirmDialog, SwipeAction } from '@/components/ui';
import { PetCard } from '@/components/shared';
import { colors } from '@/utils/colors';

type Props = NativeStackScreenProps<PetStackParamList, 'PetList'>;

const keyExtractor = (item: Pet) => item.id;

export default function PetListScreen({ navigation }: Props) {
  const { pets, loadPets, deletePet } = usePets();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Pet | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  }, [loadPets]);

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [loadPets]),
  );

  const filteredPets = useMemo(() => {
    if (searchQuery.trim().length === 0) return pets;
    const query = searchQuery.toLowerCase();
    return pets.filter((pet) => pet.name.toLowerCase().includes(query));
  }, [pets, searchQuery]);

  const handlePetPress = useCallback(
    (petId: string) => {
      navigation.navigate('PetDetail', { petId });
    },
    [navigation],
  );

  const handleAddPet = useCallback(() => {
    navigation.navigate('AddEditPet', {});
  }, [navigation]);

  const handleDeleteRequest = useCallback((pet: Pet) => {
    setDeleteTarget(pet);
    setConfirmVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) {
      deletePet(deleteTarget.id);
    }
    setConfirmVisible(false);
    setDeleteTarget(null);
  }, [deleteTarget, deletePet]);

  const handleCancelDelete = useCallback(() => {
    setConfirmVisible(false);
    setDeleteTarget(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Pet }) => (
      <PetListItem
        pet={item}
        onPress={handlePetPress}
        onDelete={handleDeleteRequest}
      />
    ),
    [handlePetPress, handleDeleteRequest],
  );

  const listEmptyComponent = useMemo(
    () => (
      <EmptyState
        icon={<PawPrint size={64} color={colors.primary[300]} />}
        title="Add your first pet!"
        subtitle="Tap the + button to add a pet and start tracking their health and activities."
        actionLabel="Add Pet"
        onAction={handleAddPet}
      />
    ),
    [handleAddPet],
  );

  const listHeaderComponent = useMemo(
    () =>
      pets.length > 0 ? (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search pets by name..."
          className="mb-4"
        />
      ) : null,
    [pets.length, searchQuery],
  );

  return (
    <SafeAreaView
      className="flex-1 bg-cream dark:bg-dark-bg"
      edges={['top']}
    >
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-text-primary dark:text-text-dark">
          My Pets
        </Text>
      </View>

      <FlatList
        data={filteredPets}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={listEmptyComponent}
        ListHeaderComponent={listHeaderComponent}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparator}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <FAB
        icon={<Plus size={24} color="#FFFFFF" />}
        onPress={handleAddPet}
        accessibilityLabel="Add new pet"
      />

      <ConfirmDialog
        visible={confirmVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Pet"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}? This action cannot be undone and all associated data will be lost.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
      />
    </SafeAreaView>
  );
}

// ── List item with swipe ──────────────────────────────────────────────

interface PetListItemProps {
  pet: Pet;
  onPress: (petId: string) => void;
  onDelete: (pet: Pet) => void;
}

const PetListItem = React.memo(function PetListItem({
  pet,
  onPress,
  onDelete,
}: PetListItemProps) {
  const handlePress = useCallback(() => {
    onPress(pet.id);
  }, [pet.id, onPress]);

  const handleDelete = useCallback(() => {
    onDelete(pet);
  }, [pet, onDelete]);

  return (
    <SwipeAction onDelete={handleDelete}>
      <PetCard pet={pet} onPress={handlePress} />
    </SwipeAction>
  );
});

// ── Separator ─────────────────────────────────────────────────────────

const ItemSeparator = React.memo(function ItemSeparator() {
  return <View className="h-3" />;
});
