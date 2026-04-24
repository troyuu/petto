import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HealthStackParamList } from '@/app/navigation/types';
import FeedingLogScreen from '@/features/feeding/screens/FeedingLogScreen';
import AddFeedingScreen from '@/features/feeding/screens/AddFeedingScreen';
import MedicationListScreen from '@/features/medications/screens/MedicationListScreen';
import AddMedicationScreen from '@/features/medications/screens/AddMedicationScreen';
import VetVisitListScreen from '@/features/vet/screens/VetVisitListScreen';
import AddVetVisitScreen from '@/features/vet/screens/AddVetVisitScreen';
import VaccinationScreen from '@/features/vet/screens/VaccinationScreen';
import WeightHistoryScreen from '@/features/weight/screens/WeightHistoryScreen';
import AddWeightScreen from '@/features/weight/screens/AddWeightScreen';
import { ErrorBoundary } from '@/components/shared';

const Stack = createNativeStackNavigator<HealthStackParamList>();

export default function HealthStack() {
  return (
    <ErrorBoundary>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="FeedingLog" component={FeedingLogScreen} />
        <Stack.Screen name="AddFeeding" component={AddFeedingScreen} />
        <Stack.Screen name="MedicationList" component={MedicationListScreen} />
        <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
        <Stack.Screen name="VetVisitList" component={VetVisitListScreen} />
        <Stack.Screen name="AddVetVisit" component={AddVetVisitScreen} />
        <Stack.Screen name="VaccinationList" component={VaccinationScreen} />
        <Stack.Screen name="WeightHistory" component={WeightHistoryScreen} />
        <Stack.Screen name="AddWeight" component={AddWeightScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
