import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Calendar } from 'lucide-react-native';
import type { HomeStackParamList, MainTabParamList } from '@/app/navigation/types';
import type { Feeding, Pet, VetVisit } from '@/utils/types';
import { usePets } from '@/hooks/usePets';
import { formatDate, daysUntil } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import * as feedingRepository from '@/database/repositories/feedingRepository';
import * as medicationRepository from '@/database/repositories/medicationRepository';
import * as medicationLogRepository from '@/database/repositories/medicationLogRepository';
import * as vetVisitRepository from '@/database/repositories/vetVisitRepository';
import * as expenseRepository from '@/database/repositories/expenseRepository';
import { Card } from '@/components/ui';
import DashboardPetCard from '@/features/dashboard/components/DashboardPetCard';
import TodaySummary from '@/features/dashboard/components/TodaySummary';
import QuickActions from '@/features/dashboard/components/QuickActions';

type DashboardNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Dashboard'>,
  BottomTabNavigationProp<MainTabParamList>
>;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 18) return 'Good afternoon!';
  return 'Good evening!';
}

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavProp>();
  const { pets, loadPets } = usePets();
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const [todayFeedings, setTodayFeedings] = useState<Feeding[]>([]);
  const [activeMedCount, setActiveMedCount] = useState(0);
  const [givenMedCount, setGivenMedCount] = useState(0);
  const [upcomingVetVisits, setUpcomingVetVisits] = useState<VetVisit[]>([]);
  const [todaySpending, setTodaySpending] = useState(0);

  const greeting = useMemo(() => getGreeting(), []);

  const activePetId = selectedPetId ?? (pets.length > 0 ? pets[0].id : null);

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [loadPets]),
  );

  useFocusEffect(
    useCallback(() => {
      if (pets.length === 0) {
        setTodayFeedings([]);
        setActiveMedCount(0);
        setGivenMedCount(0);
        setUpcomingVetVisits([]);
        setTodaySpending(0);
        return;
      }

      try {
        const targetPets = selectedPetId
          ? pets.filter((p) => p.id === selectedPetId)
          : pets;

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const todayStr = today.toISOString().split('T')[0];

        let allFeedings: Feeding[] = [];
        let totalActiveMeds = 0;
        let totalGivenMeds = 0;
        let allUpcoming: VetVisit[] = [];
        let totalSpending = 0;

        for (const pet of targetPets) {
          // Feedings
          const feedings = feedingRepository.getTodayByPet(pet.id);
          allFeedings = [...allFeedings, ...feedings];

          // Medications
          const activeMeds = medicationRepository.getActiveByPetId(pet.id);
          const todaysLogs = medicationLogRepository.getTodayByPetId(pet.id);
          const loggedMedIds = new Set(todaysLogs.map((log) => log.medicationId));
          const givenCount = activeMeds.filter((med) => loggedMedIds.has(med.id)).length;
          totalActiveMeds += activeMeds.length;
          totalGivenMeds += givenCount;

          // Vet visits
          const upcoming = vetVisitRepository.getUpcoming(pet.id);
          allUpcoming = [...allUpcoming, ...upcoming];

          // Spending
          const monthExpenses = expenseRepository.getByMonth(pet.id, year, month);
          const dayTotal = monthExpenses
            .filter((exp) => exp.expenseDate.startsWith(todayStr))
            .reduce((sum, exp) => sum + exp.amount, 0);
          totalSpending += dayTotal;
        }

        // Sort upcoming visits by date
        allUpcoming.sort(
          (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime(),
        );

        setTodayFeedings(allFeedings);
        setActiveMedCount(totalActiveMeds);
        setGivenMedCount(totalGivenMeds);
        setUpcomingVetVisits(allUpcoming);
        setTodaySpending(totalSpending);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    }, [pets, selectedPetId]),
  );

  const nextVetVisit = upcomingVetVisits.length > 0 ? upcomingVetVisits[0] : null;

  const nextVisitPet = useMemo(() => {
    if (!nextVetVisit) return null;
    return pets.find((p) => p.id === nextVetVisit.petId) ?? null;
  }, [nextVetVisit, pets]);

  const handleSelectAll = useCallback(() => {
    setSelectedPetId(null);
  }, []);

  const handleSelectPet = useCallback((pet: Pet) => {
    setSelectedPetId(pet.id);
  }, []);

  const handleFeed = useCallback(() => {
    navigation.navigate('HealthTab', {
      screen: 'AddFeeding',
      params: activePetId ? { petId: activePetId } : {},
    });
  }, [navigation, activePetId]);

  const handleMedication = useCallback(() => {
    navigation.navigate('HealthTab', {
      screen: 'AddMedication',
      params: activePetId ? { petId: activePetId } : {},
    });
  }, [navigation, activePetId]);

  const handleWeight = useCallback(() => {
    navigation.navigate('HealthTab', {
      screen: 'AddWeight',
      params: activePetId ? { petId: activePetId } : {},
    });
  }, [navigation, activePetId]);

  const handleExpense = useCallback(() => {
    navigation.navigate('ExpensesTab', {
      screen: 'AddExpense',
      params: activePetId ? { petId: activePetId } : {},
    });
  }, [navigation, activePetId]);

  return (
    <ScrollView
      className="flex-1 bg-cream dark:bg-dark-bg"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="px-5 pt-14 pb-2">
        <Text className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          Petto
        </Text>
        <Text className="text-base text-muted dark:text-muted-dark mt-0.5">
          {greeting}
        </Text>
      </View>

      {/* Pet Selector */}
      {pets.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5 py-3"
        >
          {/* All option */}
          <Pressable
            onPress={handleSelectAll}
            accessibilityLabel="Show all pets"
            accessibilityRole="button"
            accessibilityState={{ selected: selectedPetId === null }}
            className={`items-center mr-3 rounded-2xl px-3 py-2 ${
              selectedPetId === null
                ? 'border-2 border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900'
                : 'border border-gray-200 bg-white dark:border-gray-700 dark:bg-dark-card'
            }`}
          >
            <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 items-center justify-center">
              <Text className="text-sm font-bold text-primary-500 dark:text-primary-300">
                All
              </Text>
            </View>
            <Text
              className={`text-xs mt-1.5 font-medium ${
                selectedPetId === null
                  ? 'text-primary-600 dark:text-primary-300'
                  : 'text-text-primary dark:text-text-dark'
              }`}
            >
              All
            </Text>
          </Pressable>

          {pets.map((pet) => (
            <DashboardPetCard
              key={pet.id}
              pet={pet}
              isSelected={selectedPetId === pet.id}
              onPress={handleSelectPet}
            />
          ))}
        </ScrollView>
      )}

      <View className="px-5 gap-5">
        {/* Today's Summary */}
        <View>
          <Text className="text-lg font-semibold text-text-primary dark:text-text-dark mb-3">
            Today&apos;s Summary
          </Text>
          <TodaySummary
            feedingCount={todayFeedings.length}
            medsGiven={givenMedCount}
            medsDue={activeMedCount - givenMedCount}
            todaySpending={todaySpending}
          />
        </View>

        {/* Upcoming Vet Visit */}
        {nextVetVisit && (
          <View>
            <Text className="text-lg font-semibold text-text-primary dark:text-text-dark mb-3">
              Upcoming
            </Text>
            <Card>
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-accent-100 dark:bg-accent-900 items-center justify-center mr-3">
                  <Calendar size={20} color={colors.accent[500]} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-text-primary dark:text-text-dark">
                    Vet Visit{nextVisitPet ? ` - ${nextVisitPet.name}` : ''}
                  </Text>
                  <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
                    {formatDate(nextVetVisit.visitDate)}
                    {nextVetVisit.clinicName
                      ? ` at ${nextVetVisit.clinicName}`
                      : ''}
                  </Text>
                </View>
                <View className="bg-accent-100 dark:bg-accent-900 rounded-full px-2.5 py-1">
                  <Text className="text-xs font-medium text-accent-700 dark:text-accent-200">
                    {daysUntil(nextVetVisit.visitDate) === 0
                      ? 'Today'
                      : daysUntil(nextVetVisit.visitDate) === 1
                        ? 'Tomorrow'
                        : `In ${daysUntil(nextVetVisit.visitDate)}d`}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Quick Actions */}
        <View>
          <Text className="text-lg font-semibold text-text-primary dark:text-text-dark mb-3">
            Quick Actions
          </Text>
          <QuickActions
            onFeed={handleFeed}
            onMedication={handleMedication}
            onWeight={handleWeight}
            onExpense={handleExpense}
          />
        </View>
      </View>
    </ScrollView>
  );
}
