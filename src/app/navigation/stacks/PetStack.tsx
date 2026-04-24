import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PetStackParamList } from '@/app/navigation/types';
import PetListScreen from '@/features/pets/screens/PetListScreen';
import PetDetailScreen from '@/features/pets/screens/PetDetailScreen';
import AddEditPetScreen from '@/features/pets/screens/AddEditPetScreen';
import { ErrorBoundary } from '@/components/shared';

const Stack = createNativeStackNavigator<PetStackParamList>();

export default function PetStack() {
  return (
    <ErrorBoundary>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="PetList" component={PetListScreen} />
        <Stack.Screen name="PetDetail" component={PetDetailScreen} />
        <Stack.Screen name="AddEditPet" component={AddEditPetScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
