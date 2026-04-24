import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// ── Stack Param Lists ──────────────────────────────────────────────────

export type HomeStackParamList = {
  Dashboard: undefined;
};

export type PetStackParamList = {
  PetList: undefined;
  PetDetail: { petId: string };
  AddEditPet: { petId?: string };
};

export type HealthStackParamList = {
  FeedingLog: undefined;
  AddFeeding: { petId?: string };
  MedicationList: undefined;
  AddMedication: { petId?: string };
  VetVisitList: undefined;
  AddVetVisit: { petId?: string };
  VaccinationList: undefined;
  WeightHistory: undefined;
  AddWeight: { petId?: string };
};

export type ExpenseStackParamList = {
  ExpenseDashboard: undefined;
  AddExpense: { petId?: string };
  ExpenseDetail: { expenseId: string };
};

export type SettingsStackParamList = {
  Settings: undefined;
};

// ── Bottom Tab Param List ──────────────────────────────────────────────

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  PetsTab: NavigatorScreenParams<PetStackParamList>;
  HealthTab: NavigatorScreenParams<HealthStackParamList>;
  ExpensesTab: NavigatorScreenParams<ExpenseStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};

// ── Root Stack Param List ──────────────────────────────────────────────

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  PetIDCard: { petId: string };
};

// ── Typed Navigation Hook ──────────────────────────────────────────────

export function useAppNavigation() {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
}
