import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, ChevronLeft, ChevronRight, Receipt } from 'lucide-react-native';
import dayjs from 'dayjs';

import { usePets } from '@/hooks/usePets';
import { useExpenses } from '@/hooks/useExpenses';
import { useAppStore } from '@/store/useAppStore';
import { PetAvatar } from '@/components/shared';
import { Card, EmptyState, FAB } from '@/components/ui';
import { SwipeAction } from '@/components/ui';
import ExpenseSummaryCard from '@/features/expenses/components/ExpenseSummaryCard';
import ExpenseCategoryChart from '@/features/expenses/components/ExpenseCategoryChart';
import ExpenseEntryCard from '@/features/expenses/components/ExpenseEntryCard';
import { formatDate } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { ExpenseStackParamList } from '@/app/navigation/types';
import type { Expense, ExpenseCategory } from '@/utils/types';

type NavigationProp = NativeStackNavigationProp<ExpenseStackParamList, 'ExpenseDashboard'>;

const ALL_PETS_ID = '__all__';

interface CategoryChartItem {
  category: string;
  amount: number;
  percentage: number;
}

interface GroupedExpenses {
  date: string;
  expenses: Expense[];
}

export default function ExpenseDashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { pets } = usePets();
  const { expenses, loadByMonth, getMonthlySummary, getCategorySummary, deleteExpense } = useExpenses();
  const currencySymbol = useAppStore((state) => state.currencySymbol);

  const [activePetId, setActivePetId] = useState<string>(ALL_PETS_ID);
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs());
  const [refreshing, setRefreshing] = useState(false);

  const year = currentMonth.year();
  const month = currentMonth.month() + 1;
  const monthLabel = currentMonth.format('MMMM YYYY');

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activePetId === ALL_PETS_ID) {
      if (pets.length > 0) {
        await loadByMonth(pets[0].id, year, month);
      }
    } else {
      await loadByMonth(activePetId, year, month);
    }
    setRefreshing(false);
  }, [activePetId, pets, year, month, loadByMonth]);

  useFocusEffect(
    useCallback(() => {
      if (activePetId === ALL_PETS_ID) {
        // Load for all pets
        if (pets.length > 0) {
          loadByMonth(pets[0].id, year, month);
        }
      } else {
        loadByMonth(activePetId, year, month);
      }
    }, [activePetId, pets, year, month, loadByMonth]),
  );

  const monthlySummary = useMemo(() => {
    if (activePetId === ALL_PETS_ID) {
      let totalAmount = 0;
      let count = 0;
      for (const pet of pets) {
        const summary = getMonthlySummary(pet.id, year, month);
        totalAmount += summary.totalAmount;
        count += summary.count;
      }
      return { totalAmount, count, currency: 'PHP' };
    }
    return getMonthlySummary(activePetId, year, month);
  }, [activePetId, pets, year, month, getMonthlySummary]);

  const categorySummary: CategoryChartItem[] = useMemo(() => {
    let rawData: { category: ExpenseCategory; totalAmount: number; count: number }[] = [];

    if (activePetId === ALL_PETS_ID) {
      const aggregated: Record<string, number> = {};
      for (const pet of pets) {
        const data = getCategorySummary(pet.id, year, month);
        for (const item of data) {
          aggregated[item.category] = (aggregated[item.category] ?? 0) + item.totalAmount;
        }
      }
      rawData = Object.entries(aggregated).map(([category, totalAmount]) => ({
        category: category as ExpenseCategory,
        totalAmount,
        count: 0,
      }));
    } else {
      rawData = getCategorySummary(activePetId, year, month);
    }

    const maxAmount = Math.max(...rawData.map((d) => d.totalAmount), 1);
    return rawData
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .map((item) => ({
        category: item.category,
        amount: item.totalAmount,
        percentage: (item.totalAmount / maxAmount) * 100,
      }));
  }, [activePetId, pets, year, month, getCategorySummary]);

  const groupedExpenses: GroupedExpenses[] = useMemo(() => {
    const groups: Record<string, Expense[]> = {};
    for (const expense of expenses) {
      const dateKey = formatDate(expense.expenseDate, 'YYYY-MM-DD');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(expense);
    }

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, expenseList]) => ({ date, expenses: expenseList }));
  }, [expenses]);

  const handleSelectPet = useCallback((id: string) => {
    setActivePetId(id);
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => prev.subtract(1, 'month'));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const next = prev.add(1, 'month');
      if (next.isAfter(dayjs())) return prev;
      return next;
    });
  }, []);

  const handleAddExpense = useCallback(() => {
    const petIdParam = activePetId !== ALL_PETS_ID ? activePetId : undefined;
    navigation.navigate('AddExpense', { petId: petIdParam });
  }, [navigation, activePetId]);

  const handleExpensePress = useCallback(
    (expenseId: string) => {
      navigation.navigate('ExpenseDetail', { expenseId });
    },
    [navigation],
  );

  const handleDeleteExpense = useCallback(
    (id: string) => {
      deleteExpense(id);
    },
    [deleteExpense],
  );

  const handleEditExpense = useCallback(
    (expenseId: string) => {
      navigation.navigate('ExpenseDetail', { expenseId });
    },
    [navigation],
  );

  const keyExtractor = useCallback((item: GroupedExpenses) => item.date, []);

  const renderGroupedItem = useCallback(
    ({ item }: { item: GroupedExpenses }) => {
      return (
        <View className="mb-4 px-4">
          <Text className="text-sm font-semibold text-muted dark:text-muted-dark mb-2">
            {formatDate(item.date)}
          </Text>
          <View className="gap-2">
            {item.expenses.map((expense) => (
              <SwipeAction
                key={expense.id}
                onEdit={() => handleEditExpense(expense.id)}
                onDelete={() => handleDeleteExpense(expense.id)}
              >
                <ExpenseEntryCard
                  expense={expense}
                  onPress={() => handleExpensePress(expense.id)}
                />
              </SwipeAction>
            ))}
          </View>
        </View>
      );
    },
    [handleExpensePress, handleDeleteExpense, handleEditExpense],
  );

  const canGoNext = !currentMonth.add(1, 'month').isAfter(dayjs());

  const ListHeader = useMemo(
    () => (
      <View className="px-4">
        {/* Month Selector */}
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={handlePrevMonth}
            accessibilityLabel="Previous month"
            accessibilityRole="button"
            className="p-2"
          >
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>
          <Text className="text-base font-semibold text-text-primary dark:text-text-dark">
            {monthLabel}
          </Text>
          <Pressable
            onPress={handleNextMonth}
            accessibilityLabel="Next month"
            accessibilityRole="button"
            disabled={!canGoNext}
            className={`p-2 ${!canGoNext ? 'opacity-30' : ''}`}
          >
            <ChevronRight size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Summary Card */}
        <ExpenseSummaryCard
          totalAmount={monthlySummary.totalAmount}
          month={monthLabel}
          currency={currencySymbol}
        />

        {/* Category Breakdown */}
        <Card className="mb-4">
          <Text className="text-base font-semibold text-text-primary dark:text-text-dark mb-3">
            Category Breakdown
          </Text>
          <ExpenseCategoryChart data={categorySummary} />
        </Card>

        <Text className="text-base font-semibold text-text-primary dark:text-text-dark mb-2">
          Transactions
        </Text>
      </View>
    ),
    [handlePrevMonth, handleNextMonth, monthLabel, canGoNext, monthlySummary.totalAmount, currencySymbol, categorySummary],
  );

  const ListEmpty = useMemo(
    () => (
      <EmptyState
        icon={<Receipt size={48} color={colors.muted} />}
        title="No Expenses"
        subtitle="Start tracking your pet expenses to see where your money goes."
        actionLabel="Add Expense"
        onAction={handleAddExpense}
      />
    ),
    [handleAddExpense],
  );

  return (
    <View className="flex-1 bg-cream dark:bg-dark-bg">
      {/* Header */}
      <View className="px-4 pt-14 pb-3 bg-white dark:bg-dark-card">
        <Text className="text-xl font-bold text-text-primary dark:text-text-dark mb-3">
          Expenses
        </Text>

        {/* Pet Selector with "All Pets" */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-1">
          <Pressable
            onPress={() => handleSelectPet(ALL_PETS_ID)}
            accessibilityLabel="Show all pets"
            accessibilityRole="button"
            accessibilityState={{ selected: activePetId === ALL_PETS_ID }}
            className={`items-center mr-3 px-3 py-1.5 rounded-xl ${
              activePetId === ALL_PETS_ID
                ? 'bg-primary-100 dark:bg-primary-900'
                : ''
            }`}
          >
            <View className="w-10 h-10 rounded-full bg-primary-200 dark:bg-primary-800 items-center justify-center">
              <Text className="text-xs font-bold text-primary-700 dark:text-primary-200">All</Text>
            </View>
            <Text
              className={`text-xs mt-1 ${
                activePetId === ALL_PETS_ID
                  ? 'font-semibold text-primary-500 dark:text-primary-300'
                  : 'text-muted dark:text-muted-dark'
              }`}
            >
              All Pets
            </Text>
          </Pressable>

          {pets.map((pet) => {
            const isSelected = pet.id === activePetId;
            return (
              <Pressable
                key={pet.id}
                onPress={() => handleSelectPet(pet.id)}
                accessibilityLabel={`Select ${pet.name}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={`items-center mr-3 px-2 py-1.5 rounded-xl ${
                  isSelected ? 'bg-primary-100 dark:bg-primary-900' : ''
                }`}
              >
                <PetAvatar
                  photoUri={pet.photoUri}
                  petType={pet.petType}
                  name={pet.name}
                  size="sm"
                />
                <Text
                  className={`text-xs mt-1 ${
                    isSelected
                      ? 'font-semibold text-primary-500 dark:text-primary-300'
                      : 'text-muted dark:text-muted-dark'
                  }`}
                  numberOfLines={1}
                >
                  {pet.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Expense List */}
      <FlatList
        data={groupedExpenses}
        renderItem={renderGroupedItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListHeaderComponentStyle={{ paddingTop: 16 }}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* FAB */}
      <FAB
        icon={<Plus size={24} color="#FFFFFF" />}
        onPress={handleAddExpense}
        accessibilityLabel="Add expense"
      />
    </View>
  );
}
