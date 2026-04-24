import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import {
  UtensilsCrossed,
  Droplets,
  Beef,
  ChefHat,
  Cookie,
  ChevronLeft,
} from 'lucide-react-native';
import type { HealthStackParamList } from '@/app/navigation/types';
import type { FoodType, PortionUnit } from '@/utils/types';
import { usePets } from '@/hooks/usePets';
import { useFeedings } from '@/hooks/useFeedings';
import { PORTION_UNITS } from '@/utils/constants';
import { colors } from '@/utils/colors';
import { Button, Input, DatePicker } from '@/components/ui';
import { PetAvatar } from '@/components/shared';

type AddFeedingNavProp = NativeStackNavigationProp<HealthStackParamList, 'AddFeeding'>;
type AddFeedingRouteProp = RouteProp<HealthStackParamList, 'AddFeeding'>;

interface FoodTypeOption {
  value: FoodType;
  label: string;
  icon: React.ReactElement;
}

const FOOD_TYPE_OPTIONS: FoodTypeOption[] = [
  {
    value: 'dry',
    label: 'Dry',
    icon: <UtensilsCrossed size={20} color={colors.primary[500]} />,
  },
  {
    value: 'wet',
    label: 'Wet',
    icon: <Droplets size={20} color={colors.primary[500]} />,
  },
  {
    value: 'raw',
    label: 'Raw',
    icon: <Beef size={20} color={colors.primary[500]} />,
  },
  {
    value: 'homemade',
    label: 'Homemade',
    icon: <ChefHat size={20} color={colors.primary[500]} />,
  },
  {
    value: 'treats',
    label: 'Treats',
    icon: <Cookie size={20} color={colors.primary[500]} />,
  },
];

export default function AddFeedingScreen() {
  const navigation = useNavigation<AddFeedingNavProp>();
  const route = useRoute<AddFeedingRouteProp>();
  const { pets } = usePets();
  const { addFeeding } = useFeedings();

  const routePetId = route.params?.petId ?? null;

  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    routePetId ?? (pets.length > 0 ? pets[0].id : null),
  );
  const [foodType, setFoodType] = useState<FoodType>('dry');
  const [foodBrand, setFoodBrand] = useState('');
  const [portionSize, setPortionSize] = useState('');
  const [portionUnit, setPortionUnit] = useState<PortionUnit>('grams');
  const [notes, setNotes] = useState('');
  const [fedAt, setFedAt] = useState<Date>(new Date());
  const [isSaving, setIsSaving] = useState(false);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectFoodType = useCallback((type: FoodType) => {
    setFoodType(type);
  }, []);

  const handleSelectPortionUnit = useCallback((unit: PortionUnit) => {
    setPortionUnit(unit);
  }, []);

  const handleChangeFoodBrand = useCallback((text: string) => {
    setFoodBrand(text);
  }, []);

  const handleChangePortionSize = useCallback((text: string) => {
    // Only allow numeric input with decimal
    const cleaned = text.replace(/[^0-9.]/g, '');
    setPortionSize(cleaned);
  }, []);

  const handleChangeNotes = useCallback((text: string) => {
    setNotes(text);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setFedAt(date);
  }, []);

  const handleSave = useCallback(() => {
    if (!selectedPetId) {
      Alert.alert('Error', 'Please select a pet first.');
      return;
    }

    try {
      setIsSaving(true);

      const parsedPortion = portionSize ? parseFloat(portionSize) : null;

      addFeeding({
        petId: selectedPetId,
        foodType,
        foodBrand: foodBrand.trim() || null,
        portionSize: parsedPortion,
        portionUnit,
        notes: notes.trim() || null,
        fedAt: fedAt.toISOString(),
      });

      navigation.goBack();
    } catch (error) {
      console.error('Failed to save feeding:', error);
      Alert.alert('Error', 'Failed to save feeding entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [
    selectedPetId,
    foodType,
    foodBrand,
    portionSize,
    portionUnit,
    notes,
    fedAt,
    addFeeding,
    navigation,
  ]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-cream dark:bg-dark-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View className="flex-row items-center px-5 pt-14 pb-3">
        <Pressable
          onPress={handleGoBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          className="mr-3"
        >
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>
        <Text className="text-xl font-bold text-text-primary dark:text-text-dark flex-1">
          Add Feeding
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Pet Selector */}
        {!routePetId && pets.length > 0 && (
          <View className="mb-5">
            <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
              Pet
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {pets.map((pet) => {
                const isSelected = pet.id === selectedPetId;
                return (
                  <Pressable
                    key={pet.id}
                    onPress={() => setSelectedPetId(pet.id)}
                    accessibilityLabel={`Select ${pet.name}`}
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
          </View>
        )}

        {/* Date & Time */}
        <View className="mb-5">
          <DatePicker
            value={fedAt}
            onChange={handleDateChange}
            mode="datetime"
            label="Date & Time"
            maximumDate={new Date()}
            accessibilityLabel="Select feeding date and time"
          />
        </View>

        {/* Food Type Selector */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
            Food Type
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {FOOD_TYPE_OPTIONS.map((option) => {
              const isSelected = option.value === foodType;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelectFoodType(option.value)}
                  accessibilityLabel={`Select ${option.label} food type`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className={`flex-row items-center mr-2 rounded-full px-4 py-2 ${
                    isSelected
                      ? 'bg-primary-100 border-2 border-primary-500 dark:bg-primary-900 dark:border-primary-400'
                      : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <View className="mr-1.5">{option.icon}</View>
                  <Text
                    className={`text-sm font-medium ${
                      isSelected
                        ? 'text-primary-600 dark:text-primary-300'
                        : 'text-text-primary dark:text-text-dark'
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Food Brand */}
        <View className="mb-5">
          <Input
            label="Food Brand (optional)"
            value={foodBrand}
            onChangeText={handleChangeFoodBrand}
            placeholder="e.g. Royal Canin, Pedigree"
            accessibilityLabel="Food brand input"
            accessibilityHint="Enter the brand of food, this is optional"
          />
        </View>

        {/* Portion Size & Unit */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
            Portion Size
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                value={portionSize}
                onChangeText={handleChangePortionSize}
                placeholder="Amount"
                keyboardType="decimal-pad"
                accessibilityLabel="Portion size input"
                accessibilityHint="Enter the portion size as a number"
              />
            </View>
            <View className="flex-row">
              {PORTION_UNITS.map((unit) => {
                const isSelected = unit.value === portionUnit;
                return (
                  <Pressable
                    key={unit.value}
                    onPress={() => handleSelectPortionUnit(unit.value)}
                    accessibilityLabel={`Select ${unit.label} unit`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    className={`px-3 justify-center rounded-xl mr-1 ${
                      isSelected
                        ? 'bg-primary-500 dark:bg-primary-400'
                        : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        isSelected
                          ? 'text-white'
                          : 'text-text-primary dark:text-text-dark'
                      }`}
                    >
                      {unit.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Notes */}
        <View className="mb-6">
          <Input
            label="Notes (optional)"
            value={notes}
            onChangeText={handleChangeNotes}
            placeholder="Any additional notes about this feeding..."
            multiline
            accessibilityLabel="Notes input"
            accessibilityHint="Enter any additional notes about this feeding"
          />
        </View>

        {/* Save Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleSave}
          loading={isSaving}
          disabled={!selectedPetId}
          accessibilityLabel="Save feeding entry"
          className="w-full"
        >
          Save Feeding
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
