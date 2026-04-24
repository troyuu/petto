import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pill } from 'lucide-react-native';
import { Button, DatePicker, Input, TagInput } from '@/components/ui';
import { PetAvatar, ReminderToggle } from '@/components/shared';
import { usePets } from '@/hooks/usePets';
import { useMedications } from '@/hooks/useMedications';
import { MEDICATION_FREQUENCIES } from '@/utils/constants';
import { colors } from '@/utils/colors';
import type { HealthStackParamList } from '@/app/navigation/types';
import type { MedicationFrequency } from '@/utils/types';

type Props = NativeStackScreenProps<HealthStackParamList, 'AddMedication'>;

export default function AddMedicationScreen({ navigation, route }: Props) {
  const { pets, selectedPetId } = usePets();
  const { addMedication } = useMedications();

  const initialPetId = route.params?.petId ?? selectedPetId ?? pets[0]?.id ?? '';

  const [petId, setPetId] = useState(initialPetId);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<MedicationFrequency>('daily');
  const [customFrequencyDays, setCustomFrequencyDays] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDeworming, setIsDeworming] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showPetSelector = useMemo(() => !route.params?.petId && pets.length > 1, [route.params?.petId, pets.length]);

  const handleSelectPet = useCallback((id: string) => {
    setPetId(id);
  }, []);

  const handleFrequencyChange = useCallback((value: MedicationFrequency) => {
    setFrequency(value);
    if (value !== 'custom') {
      setCustomFrequencyDays('');
    }
  }, []);

  const handleStartDateChange = useCallback((date: Date) => {
    setStartDate(date);
  }, []);

  const handleEndDateChange = useCallback((date: Date) => {
    setEndDate(date);
  }, []);

  const handleCustomFrequencyChange = useCallback((text: string) => {
    // Allow only digits
    const numericText = text.replace(/[^0-9]/g, '');
    setCustomFrequencyDays(numericText);
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Medication name is required';
    }

    if (!petId) {
      newErrors.pet = 'Please select a pet';
    }

    if (frequency === 'custom' && (!customFrequencyDays || parseInt(customFrequencyDays, 10) <= 0)) {
      newErrors.customFrequency = 'Please enter the number of days';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, petId, frequency, customFrequencyDays]);

  const handleSave = useCallback(() => {
    if (!validate()) return;

    setIsSaving(true);

    try {
      addMedication({
        petId,
        name: name.trim(),
        dosage: dosage.trim() || null,
        frequency,
        customFrequencyDays:
          frequency === 'custom' ? parseInt(customFrequencyDays, 10) : null,
        timeOfDay,
        startDate: startDate.toISOString(),
        endDate: endDate?.toISOString() ?? null,
        isDeworming,
        isActive: true,
        notes: notes.trim() || null,
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save medication. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [
    validate,
    addMedication,
    petId,
    name,
    dosage,
    frequency,
    customFrequencyDays,
    timeOfDay,
    startDate,
    endDate,
    isDeworming,
    notes,
    navigation,
  ]);

  const renderPetSelector = useCallback(
    () => {
      if (!showPetSelector) return null;

      return (
        <View className="mb-4">
          <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
            Select Pet
          </Text>
          <FlatList
            horizontal
            data={pets}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3"
            renderItem={({ item }) => {
              const isSelected = item.id === petId;
              return (
                <Pressable
                  onPress={() => handleSelectPet(item.id)}
                  accessibilityLabel={`Select ${item.name}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className={`items-center px-3 py-2 rounded-xl ${
                    isSelected
                      ? 'bg-primary-100 dark:bg-primary-900 border-2 border-primary-500'
                      : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700'
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
          {errors.pet && (
            <Text className="text-sm text-red-500 mt-1">{errors.pet}</Text>
          )}
        </View>
      );
    },
    [showPetSelector, pets, petId, handleSelectPet, errors.pet],
  );

  return (
    <View className="flex-1 bg-cream dark:bg-dark-bg">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <View className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-3">
            <Pill size={24} color={colors.primary[500]} />
          </View>
          <View>
            <Text className="text-xl font-bold text-text-primary dark:text-text-dark">
              Add Medication
            </Text>
            <Text className="text-sm text-text-secondary dark:text-text-muted">
              Track medication schedules
            </Text>
          </View>
        </View>

        {/* Pet Selector */}
        {renderPetSelector()}

        {/* Name */}
        <Input
          label="Medication Name *"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Heartgard, Frontline"
          error={errors.name}
          accessibilityLabel="Medication name"
          className="mb-4"
        />

        {/* Dosage */}
        <Input
          label="Dosage"
          value={dosage}
          onChangeText={setDosage}
          placeholder="e.g., 1 tablet, 0.5 ml"
          accessibilityLabel="Dosage"
          className="mb-4"
        />

        {/* Frequency */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
            Frequency
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2"
          >
            {MEDICATION_FREQUENCIES.map((freq) => {
              const isSelected = freq.value === frequency;
              return (
                <Pressable
                  key={freq.value}
                  onPress={() => handleFrequencyChange(freq.value)}
                  accessibilityLabel={`Select ${freq.label} frequency`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className={`px-4 py-2 rounded-xl ${
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
                    {freq.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Custom Frequency Days */}
        {frequency === 'custom' && (
          <Input
            label="Every X Days"
            value={customFrequencyDays}
            onChangeText={handleCustomFrequencyChange}
            placeholder="e.g., 14"
            keyboardType="number-pad"
            error={errors.customFrequency}
            accessibilityLabel="Custom frequency in days"
            className="mb-4"
          />
        )}

        {/* Time of Day */}
        <TagInput
          tags={timeOfDay}
          onTagsChange={setTimeOfDay}
          placeholder="e.g., 8:00 AM, 8:00 PM"
          label="Time of Day"
          className="mb-4"
        />

        {/* Start Date */}
        <View className="mb-4">
          <DatePicker
            value={startDate}
            onChange={handleStartDateChange}
            mode="date"
            label="Start Date *"
            accessibilityLabel="Start date"
          />
        </View>

        {/* End Date */}
        <View className="mb-4">
          <DatePicker
            value={endDate}
            onChange={handleEndDateChange}
            mode="date"
            label="End Date (Optional)"
            minimumDate={startDate}
            accessibilityLabel="End date"
          />
        </View>

        {/* Is Deworming Toggle */}
        <View className="flex-row items-center justify-between py-3 mb-2 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-1 mr-3">
            <Text className="text-base text-text-primary dark:text-text-dark">
              Is Deworming
            </Text>
            <Text className="text-xs text-text-secondary dark:text-text-muted mt-0.5">
              Mark this as a deworming medication
            </Text>
          </View>
          <Switch
            value={isDeworming}
            onValueChange={setIsDeworming}
            trackColor={{
              false: colors.muted,
              true: colors.primary[400],
            }}
            thumbColor={isDeworming ? colors.primary[500] : '#F4F4F5'}
            accessibilityLabel="Is deworming"
            accessibilityRole="switch"
          />
        </View>

        {/* Reminder Toggle */}
        <ReminderToggle
          enabled={reminderEnabled}
          onToggle={setReminderEnabled}
          label="Enable Reminders"
          className="mb-2 border-b border-gray-100 dark:border-gray-700"
        />

        {/* Notes */}
        <Input
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any additional notes..."
          multiline
          accessibilityLabel="Notes"
          className="mb-6"
        />

        {/* Save Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleSave}
          loading={isSaving}
          accessibilityLabel="Save medication"
          className="w-full"
        >
          Save Medication
        </Button>
      </ScrollView>
    </View>
  );
}
