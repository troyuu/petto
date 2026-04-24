import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Stethoscope,
  Syringe,
  AlertCircle,
  HeartPulse,
  Scissors,
  MoreHorizontal,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Button, DatePicker, Input } from '@/components/ui';
import { PetAvatar, PhotoPicker, ReminderToggle } from '@/components/shared';
import { usePets } from '@/hooks/usePets';
import { useVetVisits } from '@/hooks/useVetVisits';
import { toCentavos } from '@/utils/formatters';
import { DEFAULT_CURRENCY } from '@/utils/constants';
import { colors } from '@/utils/colors';
import type { HealthStackParamList } from '@/app/navigation/types';
import type { VetVisitPurpose } from '@/utils/types';

type Props = NativeStackScreenProps<HealthStackParamList, 'AddVetVisit'>;

interface PurposeOption {
  label: string;
  value: VetVisitPurpose;
  Icon: LucideIcon;
}

const PURPOSE_OPTIONS: PurposeOption[] = [
  { label: 'Checkup', value: 'checkup', Icon: Stethoscope },
  { label: 'Vaccination', value: 'vaccination', Icon: Syringe },
  { label: 'Emergency', value: 'emergency', Icon: AlertCircle },
  { label: 'Surgery', value: 'surgery', Icon: HeartPulse },
  { label: 'Grooming', value: 'grooming', Icon: Scissors },
  { label: 'Other', value: 'other', Icon: MoreHorizontal },
];

const MAX_PHOTOS = 5;

export default function AddVetVisitScreen({ navigation, route }: Props) {
  const { pets, selectedPetId } = usePets();
  const { addVetVisit, addVaccination } = useVetVisits();

  const initialPetId = route.params?.petId ?? selectedPetId ?? pets[0]?.id ?? '';

  const [petId, setPetId] = useState(initialPetId);
  const [purpose, setPurpose] = useState<VetVisitPurpose>('checkup');
  const [clinicName, setClinicName] = useState('');
  const [vetName, setVetName] = useState('');
  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [costText, setCostText] = useState('');
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [nextVisitDate, setNextVisitDate] = useState<Date | null>(null);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  // Vaccination fields (shown when purpose is 'vaccination')
  const [vaccineName, setVaccineName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [nextDueDate, setNextDueDate] = useState<Date | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showPetSelector = useMemo(() => !route.params?.petId && pets.length > 1, [route.params?.petId, pets.length]);

  const handleSelectPet = useCallback((id: string) => {
    setPetId(id);
  }, []);

  const handlePurposeChange = useCallback((value: VetVisitPurpose) => {
    setPurpose(value);
  }, []);

  const handleVisitDateChange = useCallback((date: Date) => {
    setVisitDate(date);
  }, []);

  const handleNextVisitDateChange = useCallback((date: Date) => {
    setNextVisitDate(date);
    if (date) {
      setReminderEnabled(true);
    }
  }, []);

  const handleNextDueDateChange = useCallback((date: Date) => {
    setNextDueDate(date);
  }, []);

  const handleCostChange = useCallback((text: string) => {
    // Allow only digits and a single decimal point
    const sanitized = text.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = sanitized.split('.');
    if (parts.length > 2) return;
    setCostText(sanitized);
  }, []);

  const handlePhotoSelected = useCallback(
    (uri: string) => {
      if (photoUris.length < MAX_PHOTOS) {
        setPhotoUris((prev) => [...prev, uri]);
      }
    },
    [photoUris.length],
  );

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotoUris((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!petId) {
      newErrors.pet = 'Please select a pet';
    }

    if (!visitDate) {
      newErrors.visitDate = 'Visit date is required';
    }

    if (purpose === 'vaccination' && !vaccineName.trim()) {
      newErrors.vaccineName = 'Vaccine name is required for vaccination visits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [petId, visitDate, purpose, vaccineName]);

  const handleSave = useCallback(() => {
    if (!validate()) return;

    setIsSaving(true);

    try {
      const costCentavos = costText
        ? toCentavos(parseFloat(costText))
        : null;

      const newVisit = addVetVisit({
        petId,
        purpose,
        clinicName: clinicName.trim() || null,
        vetName: vetName.trim() || null,
        visitDate: visitDate.toISOString(),
        notes: notes.trim() || null,
        cost: costCentavos,
        currency: DEFAULT_CURRENCY,
        photoUris,
        nextVisitDate: nextVisitDate?.toISOString() ?? null,
        reminderEnabled,
      });

      // If purpose is vaccination, also create a vaccination record
      if (purpose === 'vaccination' && vaccineName.trim()) {
        addVaccination({
          petId,
          vetVisitId: newVisit.id,
          name: vaccineName.trim(),
          dateAdministered: visitDate.toISOString(),
          batchNumber: batchNumber.trim() || null,
          nextDueDate: nextDueDate?.toISOString() ?? null,
          notes: null,
        });
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save vet visit. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [
    validate,
    addVetVisit,
    addVaccination,
    petId,
    purpose,
    clinicName,
    vetName,
    visitDate,
    notes,
    costText,
    photoUris,
    nextVisitDate,
    reminderEnabled,
    vaccineName,
    batchNumber,
    nextDueDate,
    navigation,
  ]);

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
            <Stethoscope size={24} color={colors.primary[500]} />
          </View>
          <View>
            <Text className="text-xl font-bold text-text-primary dark:text-text-dark">
              Add Vet Visit
            </Text>
            <Text className="text-sm text-text-secondary dark:text-text-muted">
              Record veterinary appointments
            </Text>
          </View>
        </View>

        {/* Pet Selector */}
        {showPetSelector && (
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
        )}

        {/* Purpose Selector - Grid */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
            Purpose
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {PURPOSE_OPTIONS.map((option) => {
              const isSelected = option.value === purpose;
              const iconColor = isSelected ? colors.primary[500] : colors.muted;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => handlePurposeChange(option.value)}
                  accessibilityLabel={`Select ${option.label} purpose`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className={`w-[31%] items-center rounded-xl p-3 ${
                    isSelected
                      ? 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-900'
                      : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card'
                  }`}
                >
                  <option.Icon size={24} color={iconColor} />
                  <Text
                    className={`text-xs mt-1.5 text-center ${
                      isSelected
                        ? 'font-semibold text-primary-500 dark:text-primary-300'
                        : 'text-muted dark:text-muted-dark'
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Clinic Name */}
        <Input
          label="Clinic Name"
          value={clinicName}
          onChangeText={setClinicName}
          placeholder="e.g., Happy Paws Vet Clinic"
          accessibilityLabel="Clinic name"
          className="mb-4"
        />

        {/* Vet Name */}
        <Input
          label="Vet Name"
          value={vetName}
          onChangeText={setVetName}
          placeholder="e.g., Dr. Santos"
          accessibilityLabel="Vet name"
          className="mb-4"
        />

        {/* Visit Date */}
        <View className="mb-4">
          <DatePicker
            value={visitDate}
            onChange={handleVisitDateChange}
            mode="date"
            label="Visit Date *"
            error={errors.visitDate}
            accessibilityLabel="Visit date"
          />
        </View>

        {/* Notes */}
        <Input
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Diagnosis, treatments, recommendations..."
          multiline
          accessibilityLabel="Visit notes"
          className="mb-4"
        />

        {/* Cost */}
        <Input
          label="Cost"
          value={costText}
          onChangeText={handleCostChange}
          placeholder="0.00"
          keyboardType="decimal-pad"
          leftIcon={
            <Text className="text-base font-medium text-text-secondary dark:text-text-muted">
              ₱
            </Text>
          }
          accessibilityLabel="Visit cost in Philippine Pesos"
          className="mb-4"
        />

        {/* Photo Attachments */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
            Photos ({photoUris.length}/{MAX_PHOTOS})
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3"
          >
            {photoUris.map((uri, index) => (
              <View key={`photo-${index}`} className="w-24">
                <PhotoPicker
                  photoUri={uri}
                  onPhotoSelected={() => {}}
                  onRemove={() => handleRemovePhoto(index)}
                  className="w-24"
                  label={`Photo ${index + 1}`}
                />
              </View>
            ))}
            {photoUris.length < MAX_PHOTOS && (
              <View className="w-24">
                <PhotoPicker
                  photoUri={null}
                  onPhotoSelected={handlePhotoSelected}
                  className="w-24"
                  label="Add Photo"
                />
              </View>
            )}
          </ScrollView>
        </View>

        {/* Next Visit Date */}
        <View className="mb-4">
          <DatePicker
            value={nextVisitDate}
            onChange={handleNextVisitDateChange}
            mode="date"
            label="Next Visit Date (Optional)"
            minimumDate={new Date()}
            accessibilityLabel="Next visit date"
          />
        </View>

        {/* Reminder Toggle (for next visit) */}
        {nextVisitDate && (
          <ReminderToggle
            enabled={reminderEnabled}
            onToggle={setReminderEnabled}
            label="Remind me before next visit"
            className="mb-4 border-b border-gray-100 dark:border-gray-700"
          />
        )}

        {/* Vaccination Section (shown when purpose is 'vaccination') */}
        {purpose === 'vaccination' && (
          <View className="mb-4 p-4 rounded-2xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <View className="flex-row items-center mb-3">
              <Syringe size={20} color={colors.success} />
              <Text className="text-base font-semibold text-text-primary dark:text-text-dark ml-2">
                Vaccination Details
              </Text>
            </View>

            <Input
              label="Vaccine Name *"
              value={vaccineName}
              onChangeText={setVaccineName}
              placeholder="e.g., Rabies, DHPP"
              error={errors.vaccineName}
              accessibilityLabel="Vaccine name"
              className="mb-3"
            />

            <Input
              label="Batch Number"
              value={batchNumber}
              onChangeText={setBatchNumber}
              placeholder="e.g., LOT-2024-001"
              accessibilityLabel="Vaccine batch number"
              className="mb-3"
            />

            <DatePicker
              value={nextDueDate}
              onChange={handleNextDueDateChange}
              mode="date"
              label="Next Due Date"
              minimumDate={new Date()}
              accessibilityLabel="Vaccination next due date"
            />
          </View>
        )}

        {/* Save Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleSave}
          loading={isSaving}
          accessibilityLabel="Save vet visit"
          className="w-full mt-2"
        >
          Save Vet Visit
        </Button>
      </ScrollView>
    </View>
  );
}
