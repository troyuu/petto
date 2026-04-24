import React from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { NavigationContainer, type Theme } from '@react-navigation/native';
import RootNavigator from '@/app/navigation/RootNavigator';
import { useAppStore } from '@/store/useAppStore';

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
    primary: '#52B788',
    background: '#0D1117',
    card: '#161B22',
    text: '#E6EDF3',
    border: '#30363D',
    notification: '#F4A261',
  },
  fonts,
};

export default function AppNavigation() {
  const themeMode = useAppStore((state) => state.theme);
  const systemScheme = useSystemColorScheme();
  const effective = themeMode === 'system' ? systemScheme : themeMode;
  const theme = effective === 'dark' ? DarkTheme : LightTheme;

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
