import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/navigation/types';
import BottomTabNavigator from '@/app/navigation/BottomTabNavigator';
import PetIDCardScreen from '@/features/pet-id/screens/PetIDCardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="PetIDCard" component={PetIDCardScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
