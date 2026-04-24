import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ExpenseStackParamList } from '@/app/navigation/types';
import ExpenseDashboardScreen from '@/features/expenses/screens/ExpenseDashboardScreen';
import AddExpenseScreen from '@/features/expenses/screens/AddExpenseScreen';
import ExpenseDetailScreen from '@/features/expenses/screens/ExpenseDetailScreen';
import { ErrorBoundary } from '@/components/shared';

const Stack = createNativeStackNavigator<ExpenseStackParamList>();

export default function ExpenseStack() {
  return (
    <ErrorBoundary>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ExpenseDashboard" component={ExpenseDashboardScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
