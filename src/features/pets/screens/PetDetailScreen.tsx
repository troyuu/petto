import React, { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Edit2,
  Dog,
  Cat,
  PawPrint,
  Scale,
  Palette,
  Cpu,
  AlertTriangle,
  User,
  Phone,
  UtensilsCrossed,
  Pill,
  Stethoscope,
  Weight,
  DollarSign,
  FileText,
  Trash2,
} from 'lucide-react-native';
import type { PetStackParamList } from '@/app/navigation/types';
import { useAppNavigation } from '@/app/navigation/types';
import type { Pet } from '@/utils/types';
import { formatAge, formatWeight } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import { usePets } from '@/hooks/usePets';
import { Card, Badge, IconButton, Button, ConfirmDialog } from '@/components/ui';

type Props = NativeStackScreenProps<PetStackParamList, 'PetDetail'>;

function getSexLabel(sex: string): string {
  switch (sex) {
    case 'male':
      return 'Male';
    case 'female':
      return 'Female';
    default:
      return 'Unknown';
  }
}

function getPetTypeIcon(petType: string, size: number, iconColor: string) {
  switch (petType) {
    case 'dog':
      return <Dog size={size} color={iconColor} />;
    case 'cat':
      return <Cat size={size} color={iconColor} />;
    default:
      return <PawPrint size={size} color={iconColor} />;
  }
}

export default function PetDetailScreen({ navigation, route }: Props) {
  const { petId } = route.params;
  const { pets, deletePet } = usePets();
  const rootNavigation = useAppNavigation();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const pet = useMemo(
    () => pets.find((p) => p.id === petId) ?? null,
    [pets, petId],
  );

  // ── Handlers ──────────────────────────────────────────────────────
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleEdit = useCallback(() => {
    navigation.navigate('AddEditPet', { petId });
  }, [navigation, petId]);

  const handleDeleteRequest = useCallback(() => {
    setConfirmDeleteVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deletePet(petId);
    setConfirmDeleteVisible(false);
    navigation.goBack();
  }, [deletePet, petId, navigation]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteVisible(false);
  }, []);

  // ── Quick actions ─────────────────────────────────────────────────
  const handleAddFeeding = useCallback(() => {
    rootNavigation.navigate('Main', {
      screen: 'HealthTab',
      params: { screen: 'AddFeeding', params: { petId } },
    });
  }, [rootNavigation, petId]);

  const handleAddMedication = useCallback(() => {
    rootNavigation.navigate('Main', {
      screen: 'HealthTab',
      params: { screen: 'AddMedication', params: { petId } },
    });
  }, [rootNavigation, petId]);

  const handleAddVetVisit = useCallback(() => {
    rootNavigation.navigate('Main', {
      screen: 'HealthTab',
      params: { screen: 'AddVetVisit', params: { petId } },
    });
  }, [rootNavigation, petId]);

  const handleAddWeight = useCallback(() => {
    rootNavigation.navigate('Main', {
      screen: 'HealthTab',
      params: { screen: 'AddWeight', params: { petId } },
    });
  }, [rootNavigation, petId]);

  const handleAddExpense = useCallback(() => {
    rootNavigation.navigate('Main', {
      screen: 'ExpensesTab',
      params: { screen: 'AddExpense', params: { petId } },
    });
  }, [rootNavigation, petId]);

  // ── Empty state ───────────────────────────────────────────────────
  if (!pet) {
    return (
      <SafeAreaView
        className="flex-1 bg-cream dark:bg-dark-bg items-center justify-center"
        edges={['top']}
      >
        <Text className="text-lg text-muted dark:text-muted-dark">
          Pet not found
        </Text>
        <Button
          variant="ghost"
          size="md"
          onPress={handleGoBack}
          accessibilityLabel="Go back"
          className="mt-4"
        >
          Go Back
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-cream dark:bg-dark-bg"
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Navigation */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <IconButton
            icon={<ArrowLeft size={24} color={colors.text} />}
            onPress={handleGoBack}
            accessibilityLabel="Go back"
          />
          <IconButton
            icon={<Edit2 size={20} color={colors.primary[500]} />}
            onPress={handleEdit}
            variant="primary"
            accessibilityLabel="Edit pet"
          />
        </View>

        {/* Pet Photo */}
        <View className="items-center px-5 mb-4">
          {pet.photoUri ? (
            <Image
              source={{ uri: pet.photoUri }}
              className="w-32 h-32 rounded-full"
              accessibilityLabel={`${pet.name} photo`}
            />
          ) : (
            <View className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-800 items-center justify-center">
              {getPetTypeIcon(pet.petType, 56, colors.primary[500])}
            </View>
          )}
        </View>

        {/* Pet Name & Basic Info */}
        <View className="items-center px-5 mb-6">
          <Text className="text-2xl font-bold text-text-primary dark:text-text-dark mb-1">
            {pet.name}
          </Text>
          <Text className="text-base text-muted dark:text-muted-dark mb-2">
            {pet.breed ?? 'Unknown breed'}
          </Text>
          <View className="flex-row gap-2">
            <Badge label={formatAge(pet.birthday)} variant="primary" size="md" />
            <Badge label={getSexLabel(pet.sex)} variant="accent" size="md" />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-6">
          <Text className="text-base font-semibold text-text-primary dark:text-text-dark mb-3">
            Quick Actions
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            <QuickActionButton
              icon={<UtensilsCrossed size={20} color={colors.primary[500]} />}
              label="Feed"
              onPress={handleAddFeeding}
            />
            <QuickActionButton
              icon={<Pill size={20} color={colors.accent[500]} />}
              label="Medication"
              onPress={handleAddMedication}
            />
            <QuickActionButton
              icon={<Stethoscope size={20} color={colors.info} />}
              label="Vet Visit"
              onPress={handleAddVetVisit}
            />
            <QuickActionButton
              icon={<Weight size={20} color={colors.success} />}
              label="Weight"
              onPress={handleAddWeight}
            />
            <QuickActionButton
              icon={<DollarSign size={20} color={colors.warning} />}
              label="Expense"
              onPress={handleAddExpense}
            />
          </ScrollView>
        </View>

        {/* Info Cards */}
        <View className="px-5 gap-3">
          {/* Weight Card */}
          {pet.weight != null && (
            <InfoRow
              icon={<Scale size={18} color={colors.primary[500]} />}
              label="Weight"
              value={formatWeight(pet.weight, pet.weightUnit)}
            />
          )}

          {/* Color Card */}
          {pet.color && (
            <InfoRow
              icon={<Palette size={18} color={colors.accent[500]} />}
              label="Color / Markings"
              value={pet.color}
            />
          )}

          {/* Microchip Card */}
          {pet.microchipNumber && (
            <InfoRow
              icon={<Cpu size={18} color={colors.info} />}
              label="Microchip"
              value={pet.microchipNumber}
            />
          )}

          {/* Allergies Card */}
          {pet.allergies.length > 0 && (
            <Card>
              <View className="flex-row items-center mb-2">
                <AlertTriangle size={18} color={colors.warning} />
                <Text className="text-sm font-semibold text-text-primary dark:text-text-dark ml-2">
                  Allergies
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-1.5">
                {pet.allergies.map((allergy, index) => (
                  <Badge
                    key={`${allergy}-${index}`}
                    label={allergy}
                    variant="warning"
                    size="sm"
                  />
                ))}
              </View>
            </Card>
          )}

          {/* Owner Info Card */}
          {(pet.ownerName || pet.ownerContact) && (
            <Card>
              <Text className="text-sm font-semibold text-text-primary dark:text-text-dark mb-2">
                Owner Information
              </Text>
              {pet.ownerName && (
                <View className="flex-row items-center mb-1.5">
                  <User size={16} color={colors.muted} />
                  <Text className="text-sm text-text-primary dark:text-text-dark ml-2">
                    {pet.ownerName}
                  </Text>
                </View>
              )}
              {pet.ownerContact && (
                <View className="flex-row items-center">
                  <Phone size={16} color={colors.muted} />
                  <Text className="text-sm text-text-primary dark:text-text-dark ml-2">
                    {pet.ownerContact}
                  </Text>
                </View>
              )}
            </Card>
          )}

          {/* Notes Card */}
          {pet.notes && (
            <Card>
              <View className="flex-row items-center mb-2">
                <FileText size={18} color={colors.muted} />
                <Text className="text-sm font-semibold text-text-primary dark:text-text-dark ml-2">
                  Notes
                </Text>
              </View>
              <Text className="text-sm text-text-secondary dark:text-text-muted leading-5">
                {pet.notes}
              </Text>
            </Card>
          )}

          {/* Recent Activity (Placeholder) */}
          <Card>
            <Text className="text-base font-semibold text-text-primary dark:text-text-dark mb-2">
              Recent Activity
            </Text>
            <Text className="text-sm text-muted dark:text-muted-dark">
              Activity tracking will appear here as you log feedings, medications, vet visits, and more.
            </Text>
          </Card>

          {/* Delete Button */}
          <View className="mt-4 mb-2">
            <Button
              variant="destructive"
              size="md"
              onPress={handleDeleteRequest}
              leftIcon={<Trash2 size={18} color="#FFFFFF" />}
              accessibilityLabel="Delete pet"
              className="w-full"
            >
              Delete Pet
            </Button>
          </View>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirmDeleteVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Pet"
        message={`Are you sure you want to delete ${pet.name}? This action cannot be undone and all associated data will be lost.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
      />
    </SafeAreaView>
  );
}

// ── InfoRow ───────────────────────────────────────────────────────────

interface InfoRowProps {
  icon: React.ReactElement;
  label: string;
  value: string;
}

const InfoRow = React.memo(function InfoRow({
  icon,
  label,
  value,
}: InfoRowProps) {
  return (
    <Card>
      <View className="flex-row items-center">
        {icon}
        <Text className="text-sm font-semibold text-text-primary dark:text-text-dark ml-2 flex-1">
          {label}
        </Text>
        <Text className="text-sm text-text-secondary dark:text-text-muted">
          {value}
        </Text>
      </View>
    </Card>
  );
});

// ── QuickActionButton ─────────────────────────────────────────────────

interface QuickActionButtonProps {
  icon: React.ReactElement;
  label: string;
  onPress: () => void;
}

const QuickActionButton = React.memo(function QuickActionButton({
  icon,
  label,
  onPress,
}: QuickActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Add ${label}`}
      accessibilityRole="button"
      className="items-center bg-white dark:bg-dark-card rounded-2xl px-4 py-3 shadow-sm min-w-[80px]"
    >
      <View className="mb-1.5">{icon}</View>
      <Text className="text-xs font-medium text-text-primary dark:text-text-dark">
        {label}
      </Text>
    </Pressable>
  );
});
