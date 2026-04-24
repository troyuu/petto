import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import dayjs from 'dayjs';
import type { PetStackParamList } from '@/app/navigation/types';
import type { Pet, PetType, Sex, WeightUnit } from '@/utils/types';
import { PET_TYPES, WEIGHT_UNITS, DEFAULT_WEIGHT_UNIT } from '@/utils/constants';
import { formatAge } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import { usePets } from '@/hooks/usePets';
import { Button, Input, DatePicker, TagInput, IconButton } from '@/components/ui';
import { PhotoPicker } from '@/components/shared';
import BreedPicker from '@/features/pets/components/BreedPicker';

type Props = NativeStackScreenProps<PetStackParamList, 'AddEditPet'>;

const SEX_OPTIONS: { label: string; value: Sex }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Unknown', value: 'unknown' },
];

export default function AddEditPetScreen({ navigation, route }: Props) {
  const petId = route.params?.petId;
  const isEdit = Boolean(petId);
  const { pets, addPet, updatePet } = usePets();

  // ── Form state ────────────────────────────────────────────────────
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [petType, setPetType] = useState<PetType>('dog');
  const [breed, setBreed] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [sex, setSex] = useState<Sex>('unknown');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(DEFAULT_WEIGHT_UNIT);
  const [color, setColor] = useState('');
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [notes, setNotes] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ── Load existing pet for edit mode ───────────────────────────────
  useEffect(() => {
    if (!petId) return;
    const existingPet = pets.find((p) => p.id === petId);
    if (!existingPet) return;

    setPhotoUri(existingPet.photoUri);
    setName(existingPet.name);
    setPetType(existingPet.petType);
    setBreed(existingPet.breed);
    setBirthday(existingPet.birthday ? new Date(existingPet.birthday) : null);
    setSex(existingPet.sex);
    setWeight(existingPet.weight != null ? String(existingPet.weight) : '');
    setWeightUnit(existingPet.weightUnit);
    setColor(existingPet.color ?? '');
    setMicrochipNumber(existingPet.microchipNumber ?? '');
    setAllergies(existingPet.allergies);
    setOwnerName(existingPet.ownerName ?? '');
    setOwnerContact(existingPet.ownerContact ?? '');
    setNotes(existingPet.notes ?? '');
  }, [petId, pets]);

  // ── Age display ───────────────────────────────────────────────────
  const ageDisplay = useMemo(() => {
    if (!birthday) return null;
    return formatAge(birthday.toISOString());
  }, [birthday]);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePhotoSelected = useCallback((uri: string) => {
    setPhotoUri(uri);
  }, []);

  const handlePhotoRemove = useCallback(() => {
    setPhotoUri(null);
  }, []);

  const handleNameChange = useCallback((text: string) => {
    setName(text);
    if (text.trim().length > 0) {
      setNameError('');
    }
  }, []);

  const handlePetTypeSelect = useCallback((type: PetType) => {
    setPetType(type);
    setBreed(null); // Reset breed when pet type changes
  }, []);

  const handleBreedSelect = useCallback((selectedBreed: string) => {
    setBreed(selectedBreed);
  }, []);

  const handleBirthdayChange = useCallback((date: Date) => {
    setBirthday(date);
  }, []);

  const handleSexSelect = useCallback((selectedSex: Sex) => {
    setSex(selectedSex);
  }, []);

  const handleWeightChange = useCallback((text: string) => {
    // Allow only valid decimal numbers
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    setWeight(cleaned);
  }, []);

  const handleWeightUnitSelect = useCallback((unit: WeightUnit) => {
    setWeightUnit(unit);
  }, []);

  const handleSave = useCallback(() => {
    // Validate
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      setNameError('Name is required');
      return;
    }

    setIsSaving(true);

    try {
      const petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'> = {
        name: trimmedName,
        petType,
        breed,
        birthday: birthday ? dayjs(birthday).toISOString() : null,
        sex,
        weight: weight.length > 0 ? parseFloat(weight) : null,
        weightUnit,
        color: color.trim().length > 0 ? color.trim() : null,
        microchipNumber:
          microchipNumber.trim().length > 0 ? microchipNumber.trim() : null,
        photoUri,
        ownerName: ownerName.trim().length > 0 ? ownerName.trim() : null,
        ownerContact:
          ownerContact.trim().length > 0 ? ownerContact.trim() : null,
        allergies,
        notes: notes.trim().length > 0 ? notes.trim() : null,
      };

      if (isEdit && petId) {
        updatePet(petId, petData);
      } else {
        addPet(petData);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save pet. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [
    name,
    petType,
    breed,
    birthday,
    sex,
    weight,
    weightUnit,
    color,
    microchipNumber,
    photoUri,
    ownerName,
    ownerContact,
    allergies,
    notes,
    isEdit,
    petId,
    addPet,
    updatePet,
    navigation,
  ]);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <SafeAreaView
      className="flex-1 bg-cream dark:bg-dark-bg"
      edges={['top']}
    >
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <IconButton
          icon={<ArrowLeft size={24} color={colors.text} />}
          onPress={handleGoBack}
          accessibilityLabel="Go back"
          className="mr-3"
        />
        <Text className="text-xl font-bold text-text-primary dark:text-text-dark flex-1">
          {isEdit ? 'Edit Pet' : 'Add New Pet'}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Photo Picker */}
          <View className="items-center mt-4 mb-6">
            <PhotoPicker
              photoUri={photoUri}
              onPhotoSelected={handlePhotoSelected}
              onRemove={handlePhotoRemove}
              label="Add Pet Photo"
              className="w-32"
            />
          </View>

          {/* Name */}
          <Input
            label="Name *"
            value={name}
            onChangeText={handleNameChange}
            placeholder="Enter pet name"
            error={nameError}
            accessibilityLabel="Pet name"
            accessibilityHint="Required. Enter your pet's name"
            className="mb-4"
          />

          {/* Pet Type Selector */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-1.5">
              Type
            </Text>
            <View className="flex-row gap-2">
              {PET_TYPES.map((type) => (
                <PillButton
                  key={type.value}
                  label={type.label}
                  selected={petType === type.value}
                  onPress={() => handlePetTypeSelect(type.value)}
                  accessibilityLabel={`Pet type ${type.label}`}
                />
              ))}
            </View>
          </View>

          {/* Breed Picker */}
          <View className="mb-4">
            <BreedPicker
              petType={petType}
              selectedBreed={breed}
              onSelect={handleBreedSelect}
            />
          </View>

          {/* Birthday */}
          <View className="mb-4">
            <DatePicker
              value={birthday}
              onChange={handleBirthdayChange}
              mode="date"
              label="Birthday"
              maximumDate={new Date()}
              accessibilityLabel="Pet birthday"
            />
            {ageDisplay && (
              <Text className="text-sm text-primary-600 dark:text-primary-300 mt-1">
                {ageDisplay}
              </Text>
            )}
          </View>

          {/* Sex Selector */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-1.5">
              Sex
            </Text>
            <View className="flex-row gap-2">
              {SEX_OPTIONS.map((option) => (
                <PillButton
                  key={option.value}
                  label={option.label}
                  selected={sex === option.value}
                  onPress={() => handleSexSelect(option.value)}
                  accessibilityLabel={`Sex ${option.label}`}
                />
              ))}
            </View>
          </View>

          {/* Weight + Unit */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-1.5">
              Weight
            </Text>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Input
                  value={weight}
                  onChangeText={handleWeightChange}
                  placeholder="0.0"
                  keyboardType="decimal-pad"
                  accessibilityLabel="Pet weight"
                  accessibilityHint="Enter weight as a number"
                />
              </View>
              <View className="flex-row gap-1 items-center">
                {WEIGHT_UNITS.map((unit) => (
                  <PillButton
                    key={unit.value}
                    label={unit.label}
                    selected={weightUnit === unit.value}
                    onPress={() => handleWeightUnitSelect(unit.value)}
                    accessibilityLabel={`Weight unit ${unit.label}`}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Color / Markings */}
          <Input
            label="Color / Markings"
            value={color}
            onChangeText={setColor}
            placeholder="e.g. Brown with white paws"
            accessibilityLabel="Color or markings"
            className="mb-4"
          />

          {/* Microchip Number */}
          <Input
            label="Microchip Number"
            value={microchipNumber}
            onChangeText={setMicrochipNumber}
            placeholder="e.g. 900123456789012"
            accessibilityLabel="Microchip number"
            className="mb-4"
          />

          {/* Allergies */}
          <TagInput
            tags={allergies}
            onTagsChange={setAllergies}
            label="Allergies"
            placeholder="Add allergy..."
            className="mb-4"
          />

          {/* Owner Name */}
          <Input
            label="Owner Name"
            value={ownerName}
            onChangeText={setOwnerName}
            placeholder="Enter owner name"
            accessibilityLabel="Owner name"
            className="mb-4"
          />

          {/* Owner Contact */}
          <Input
            label="Owner Contact"
            value={ownerContact}
            onChangeText={setOwnerContact}
            placeholder="Phone number or email"
            keyboardType="phone-pad"
            accessibilityLabel="Owner contact"
            className="mb-4"
          />

          {/* Notes */}
          <Input
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes about your pet..."
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
            accessibilityLabel={isEdit ? 'Save changes' : 'Add pet'}
            className="w-full"
          >
            {isEdit ? 'Save Changes' : 'Add Pet'}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── PillButton (horizontal selector) ──────────────────────────────────

interface PillButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

const PillButton = React.memo(function PillButton({
  label,
  selected,
  onPress,
  accessibilityLabel,
}: PillButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`px-4 py-2 rounded-full border-2 ${
        selected
          ? 'bg-primary-500 dark:bg-primary-400 border-primary-500 dark:border-primary-400'
          : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-600'
      }`}
    >
      <Text
        className={`text-sm font-semibold ${
          selected
            ? 'text-white'
            : 'text-text-primary dark:text-text-dark'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
});
