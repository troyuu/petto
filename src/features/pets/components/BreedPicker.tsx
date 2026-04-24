import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import type { PetType } from '@/utils/types';
import { DOG_BREEDS, CAT_BREEDS } from '@/utils/constants';
import { colors } from '@/utils/colors';
import { SearchBar, Input } from '@/components/ui';

interface BreedPickerProps {
  petType: PetType;
  selectedBreed: string | null;
  onSelect: (breed: string) => void;
}

interface BreedItemProps {
  breed: string;
  isSelected: boolean;
  onPress: (breed: string) => void;
}

const BreedItem = React.memo(function BreedItem({
  breed,
  isSelected,
  onPress,
}: BreedItemProps) {
  const handlePress = useCallback(() => {
    onPress(breed);
  }, [breed, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={`Select breed ${breed}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`flex-row items-center justify-between px-4 py-3 rounded-xl mb-1.5 ${
        isSelected
          ? 'bg-primary-100 dark:bg-primary-900'
          : 'bg-white dark:bg-dark-card'
      }`}
    >
      <Text
        className={`text-base ${
          isSelected
            ? 'font-semibold text-primary-700 dark:text-primary-200'
            : 'text-text-primary dark:text-text-dark'
        }`}
      >
        {breed}
      </Text>
      {isSelected && <Check size={20} color={colors.primary[500]} />}
    </Pressable>
  );
});

const BreedPicker: React.FC<BreedPickerProps> = ({
  petType,
  selectedBreed,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customBreed, setCustomBreed] = useState(selectedBreed ?? '');

  const breeds = useMemo(() => {
    if (petType === 'dog') return DOG_BREEDS;
    if (petType === 'cat') return CAT_BREEDS;
    return [];
  }, [petType]);

  const filteredBreeds = useMemo(() => {
    if (searchQuery.trim().length === 0) return breeds;
    const query = searchQuery.toLowerCase();
    return breeds.filter((breed) => breed.toLowerCase().includes(query));
  }, [breeds, searchQuery]);

  const handleBreedSelect = useCallback(
    (breed: string) => {
      onSelect(breed);
    },
    [onSelect],
  );

  const handleCustomBreedChange = useCallback(
    (text: string) => {
      setCustomBreed(text);
      if (text.trim().length > 0) {
        onSelect(text.trim());
      }
    },
    [onSelect],
  );

  if (petType === 'other') {
    return (
      <Input
        label="Breed / Species"
        value={customBreed}
        onChangeText={handleCustomBreedChange}
        placeholder="e.g. Rabbit, Hamster, Parrot"
        accessibilityLabel="Breed or species"
        accessibilityHint="Enter the breed or species of your pet"
      />
    );
  }

  return (
    <View className="flex-1">
      <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-1.5">
        Breed
      </Text>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search breeds..."
        className="mb-3"
      />
      {filteredBreeds.length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-sm text-muted dark:text-muted-dark">
            No breeds match your search
          </Text>
        </View>
      ) : (
        <View>
          {filteredBreeds.map((item) => (
            <BreedItem
              key={item}
              breed={item}
              isSelected={selectedBreed === item}
              onPress={handleBreedSelect}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default React.memo(BreedPicker);
