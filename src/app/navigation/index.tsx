import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, type Theme } from '@react-navigation/native';
import RootNavigator from '@/app/navigation/RootNavigator';

const fonts = {
  regular: { fontFamily: 'System', fontWeight: '400' as const },
  medium: { fontFamily: 'System', fontWeight: '500' as const },
  bold: { fontFamily: 'System', fontWeight: '700' as const },
  heavy: { fontFamily: 'System', fontWeight: '800' as const },
};

const LightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#2D6A4F',
    background: '#FDF6EC',
    card: '#FFFFFF',
    text: '#1A1A2E',
    border: '#E5E7EB',
    notification: '#E76F51',
  },
  fonts,
};

const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#2D6A4F',
    background: '#1A1A2E',
    card: '#16213E',
    text: '#E8E8E8',
    border: '#1E2A47',
    notification: '#F4A261',
  },
  fonts,
};

export default function AppNavigation() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export { LightTheme, DarkTheme };
export { useAppNavigation } from '@/app/navigation/types';
export type {
  RootStackParamList,
  MainTabParamList,
  HomeStackParamList,
  PetStackParamList,
  HealthStackParamList,
  ExpenseStackParamList,
  SettingsStackParamList,
} from '@/app/navigation/types';
