import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/navigation/types';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';
import { ErrorBoundary } from '@/components/shared';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <ErrorBoundary>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
