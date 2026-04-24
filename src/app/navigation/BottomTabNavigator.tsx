import React from 'react';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, PawPrint, HeartPulse, Wallet, Settings } from 'lucide-react-native';
import type { MainTabParamList } from '@/app/navigation/types';
import HomeStack from '@/app/navigation/stacks/HomeStack';
import PetStack from '@/app/navigation/stacks/PetStack';
import HealthStack from '@/app/navigation/stacks/HealthStack';
import ExpenseStack from '@/app/navigation/stacks/ExpenseStack';
import SettingsStack from '@/app/navigation/stacks/SettingsStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ACTIVE_COLOR = '#2D6A4F';
const INACTIVE_COLOR = '#6B7280';

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: isDark ? '#16213E' : '#FFFFFF',
          borderTopColor: isDark ? '#1E2A47' : '#E5E7EB',
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
