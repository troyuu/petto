import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as feedingRepository from '@/database/repositories/feedingRepository';
import * as medicationRepository from '@/database/repositories/medicationRepository';
import * as medicationLogRepository from '@/database/repositories/medicationLogRepository';
import * as vetVisitRepository from '@/database/repositories/vetVisitRepository';
import * as expenseRepository from '@/database/repositories/expenseRepository';
import type { Feeding, Medication, VetVisit } from '@/utils/types';

interface DashboardData {
  todayFeedings: Feeding[];
  dueMedications: Medication[];
  upcomingVetVisits: VetVisit[];
  todaySpending: number;
  isLoading: boolean;
}

export function useDashboard(petId: string | null): DashboardData {
  const [todayFeedings, setTodayFeedings] = useState<Feeding[]>([]);
  const [dueMedications, setDueMedications] = useState<Medication[]>([]);
  const [upcomingVetVisits, setUpcomingVetVisits] = useState<VetVisit[]>([]);
  const [todaySpending, setTodaySpending] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!petId) {
        setTodayFeedings([]);
        setDueMedications([]);
        setUpcomingVetVisits([]);
        setTodaySpending(0);
        return;
      }

      try {
        setIsLoading(true);

        // Load today's feedings
        const feedings = feedingRepository.getTodayByPet(petId);
        setTodayFeedings(feedings);

        // Load active medications and filter for due ones
        const activeMeds = medicationRepository.getActiveByPetId(petId);
        const todaysLogs = medicationLogRepository.getTodayByPetId(petId);
        const loggedMedIds = new Set(todaysLogs.map((log) => log.medicationId));
        const due = activeMeds.filter((med) => !loggedMedIds.has(med.id));
        setDueMedications(due);

        // Load upcoming vet visits
        const upcoming = vetVisitRepository.getUpcoming(petId);
        setUpcomingVetVisits(upcoming);

        // Calculate today's spending
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const todayStr = today.toISOString().split('T')[0];
        const monthExpenses = expenseRepository.getByMonth(petId, year, month);
        const todayTotal = monthExpenses
          .filter((exp) => exp.expenseDate.startsWith(todayStr))
          .reduce((sum, exp) => sum + exp.amount, 0);
        setTodaySpending(todayTotal);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }, [petId]),
  );

  return {
    todayFeedings,
    dueMedications,
    upcomingVetVisits,
    todaySpending,
    isLoading,
  };
}
