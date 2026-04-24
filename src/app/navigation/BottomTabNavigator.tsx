import React from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, PawPrint, HeartPulse, Wallet, Settings } from 'lucide-react-native';
import type { MainTabParamList } from '@/app/navigation/types';
import HomeStack from '@/app/navigation/stacks/HomeStack';
import PetStack from '@/app/navigation/stacks/PetStack';
import HealthStack from '@/app/navigation/stacks/HealthStack';
import ExpenseStack from '@/app/navigation/stacks/ExpenseStack';
import SettingsStack from '@/app/navigation/stacks/SettingsStack';
import { useAppStore } from '@/store/useAppStore';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ACTIVE_COLOR_LIGHT = '#2D6A4F';
const ACTIVE_COLOR_DARK = '#52B788';
const INACTIVE_COLOR_LIGHT = '#6B7280';
const INACTIVE_COLOR_DARK = '#8B949E';

export default function BottomTabNavigator() {
  const themeMode = useAppStore((state) => state.theme);
  const systemScheme = useSystemColorScheme();
  const effective = themeMode === 'system' ? systemScheme : themeMode;
  const isDark = effective === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? ACTIVE_COLOR_DARK : ACTIVE_COLOR_LIGHT,
        tabBarInactiveTintColor: isDark ? INACTIVE_COLOR_DARK : INACTIVE_COLOR_LIGHT,
        tabBarStyle: {
          backgroundColor: isDark ? '#161B22' : '#FFFFFF',
          borderTopColor: isDark ? '#30363D' : '#E5E7EB',
        },
        popToTopOnBlur: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarButtonTestID: 'tab-home',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PetsTab"
        component={PetStack}
        options={{
          tabBarLabel: 'Pets',
          tabBarButtonTestID: 'tab-pets',
          tabBarIcon: ({ color, size }) => (
            <PawPrint color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="HealthTab"
        component={HealthStack}
        options={{
          tabBarLabel: 'Health',
          tabBarButtonTestID: 'tab-health',
          tabBarIcon: ({ color, size }) => (
            <HeartPulse color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ExpensesTab"
        component={ExpenseStack}
        options={{
          tabBarLabel: 'Expenses',
          tabBarButtonTestID: 'tab-expenses',
          tabBarIcon: ({ color, size }) => (
            <Wallet color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          tabBarButtonTestID: 'tab-settings',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
