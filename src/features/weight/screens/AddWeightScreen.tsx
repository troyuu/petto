import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import dayjs from 'dayjs';

import { usePets } from '@/hooks/usePets';
import { useWeights } from '@/hooks/useWeights';
import { useWeightStore } from '@/store/useWeightStore';
import { PetAvatar } from '@/components/shared';
import { Button, Input, DatePicker, IconButton } from '@/components/ui';
import { formatDate, formatWeight } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { HealthStackParamList } from '@/app/navigation/types';
import type { WeightUnit } from '@/utils/types';

type NavigationProp = NativeStackNavigationProp<HealthStackParamList, 'AddWeight'>;
type AddWeightRouteProp = RouteProp<HealthStackParamList, 'AddWeight'>;

export default function AddWeightScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddWeightRouteProp>();
  const { pets, selectedPetId } = usePets();
  const { addEntry } = useWeights();
  const getLatest = useWeightStore((state) => state.getLatest);

  const initialPetId = route.params?.petId ?? selectedPetId ?? pets[0]?.id ?? '';
  const [petId, setPetId] = useState<string>(initialPetId);
  const [weightValue, setWeightValue] = useState<string>('');
  const [unit, setUnit] = useState<WeightUnit>('kg');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const latestEntry = useMemo(() => {
    if (!petId) return null;
    return getLatest(petId);
  }, [petId, getLatest]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectPet = useCallback((id: string) => {
    setPetId(id);
  }, []);

  const handleToggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'kg' ? 'lbs' : 'kg'));
  }, []);

  const handleSave = useCallback(() => {
    const weight = parseFloat(weightValue);
    if (!petId) {
      Alert.alert('Error', 'Please select a pet.');
      return;
    }
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Error', 'Please enter a valid weight.');
      return;
    }

    setIsSaving(true);
    try {
      addEntry({
        petId,
        weight,
        unit,
        measuredAt: dayjs(date).toISOString(),
        notes: notes.trim() || null,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save weight entry.');
      setIsSaving(false);
    }
  }, [petId, weightValue, unit, date, notes, addEntry, navigation]);

  const isValid = petId.length > 0 && weightValue.length > 0 && !isNaN(parseFloat(weightValue));

  return (
    <View className="flex-1 bg-cream dark:bg-dark-bg">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-3 bg-white dark:bg-dark-card">
        <IconButton
          icon={<ArrowLeft size={22} color={colors.text} />}
          onPress={handleGoBack}
          accessibilityLabel="Go back"
          className="mr-3"
        />
        <Text className="text-xl font-bold text-text-primary dark:text-text-dark">
          Add Weight
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Pet Selector */}
        {pets.length > 1 && (
          <View className="mb-5">
            <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
              Select Pet
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pets.map((pet) => {
                const isSelected = pet.id === petId;
                return (
                  <Pressable
                    key={pet.id}
                    onPress={() => handleSelectPet(pet.id)}
                    accessibilityLabel={`Select ${pet.name}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    className={`items-center mr-3 px-3 py-2 rounded-xl ${
                      isSelected
                        ? 'bg-primary-100 dark:bg-primary-900 border border-primary-500'
                        : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <PetAvatar
                      photoUri={pet.photoUri}
                      petType={pet.petType}
                      name={pet.name}
                      size="sm"
                    />
                    <Text
                      className={`text-xs mt-1 ${
                        isSelected
                          ? 'font-semibold text-primary-500 dark:text-primary-300'
                          : 'text-muted dark:text-muted-dark'
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

        {/* Weight Input */}
        <View className="flex-row items-end gap-3 mb-5">
          <View className="flex-1">
            <Input
              label="Weight"
              value={weightValue}
              onChangeText={setWeightValue}
              placeholder="0.0"
              keyboardType="decimal-pad"
              accessibilityLabel="Weight value"
              accessibilityHint="Enter the weight measurement"
            />
          </View>
          <Pressable
            onPress={handleToggleUnit}
            accessibilityLabel={`Unit: ${unit}. Tap to switch.`}
            accessibilityRole="button"
            className="h-12 px-4 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900 border-2 border-primary-500"
          >
            <Text className="text-sm font-bold text-primary-500 dark:text-primary-300">
              {unit}
            </Text>
          </Pressable>
        </View>

        {/* Date Picker */}
        <View className="mb-5">
          <DatePicker
            label="Date"
            value={date}
            onChange={setDate}
            mode="date"
            maximumDate={new Date()}
            accessibilityLabel="Measurement date"
          />
        </View>

        {/* Notes */}
        <View className="mb-5">
          <Input
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Any notes about this measurement..."
            multiline
            accessibilityLabel="Notes"
          />
        </View>

        {/* Last recorded info */}
        {latestEntry ? (
          <View className="bg-primary-50 dark:bg-primary-900 rounded-xl p-3 mb-6">
            <Text className="text-sm text-primary-700 dark:text-primary-200">
              Last recorded: {formatWeight(latestEntry.weight, latestEntry.unit)} on{' '}
              {formatDate(latestEntry.measuredAt)}
            </Text>
          </View>
        ) : null}

        {/* Save Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleSave}
          disabled={!isValid}
          loading={isSaving}
          accessibilityLabel="Save weight entry"
          className="w-full"
        >
          Save Weight
        </Button>
      </ScrollView>
    </View>
  );
}
