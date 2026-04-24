import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Alert, Modal as RNModal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  UtensilsCrossed,
  Stethoscope,
  Scissors,
  ShoppingBag,
  Pill,
  Shield,
  MoreHorizontal,
  X,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { usePets } from '@/hooks/usePets';
import { useExpenses } from '@/hooks/useExpenses';
import { Card, Badge, Button, IconButton, ConfirmDialog } from '@/components/ui';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import type { ExpenseStackParamList } from '@/app/navigation/types';
import type { ExpenseCategory } from '@/utils/types';

type NavigationProp = NativeStackNavigationProp<ExpenseStackParamList, 'ExpenseDetail'>;
type DetailRouteProp = RouteProp<ExpenseStackParamList, 'ExpenseDetail'>;

const CATEGORY_ICONS: Record<ExpenseCategory, LucideIcon> = {
  food: UtensilsCrossed,
  vet_bills: Stethoscope,
  grooming: Scissors,
  accessories: ShoppingBag,
  medication: Pill,
  insurance: Shield,
  other: MoreHorizontal,
};

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Food',
  vet_bills: 'Vet Bills',
  grooming: 'Grooming',
  accessories: 'Accessories',
  medication: 'Medication',
  insurance: 'Insurance',
  other: 'Other',
};

export default function ExpenseDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const { pets } = usePets();
  const { expenses, deleteExpense } = useExpenses();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const expenseId = route.params.expenseId;

  const expense = useMemo(
    () => expenses.find((e) => e.id === expenseId) ?? null,
    [expenses, expenseId],
  );

  const petName = useMemo(() => {
    if (!expense) return 'Unknown';
    return pets.find((p) => p.id === expense.petId)?.name ?? 'Unknown';
  }, [pets, expense]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleDelete = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (expense) {
      deleteExpense(expense.id);
      setShowDeleteDialog(false);
      navigation.goBack();
    }
  }, [expense, deleteExpense, navigation]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  const handleOpenReceipt = useCallback(() => {
    setShowReceiptModal(true);
  }, []);

  const handleCloseReceipt = useCallback(() => {
    setShowReceiptModal(false);
  }, []);

  const handleEdit = useCallback(() => {
    // Navigate back; future edit screen can be added
    Alert.alert('Edit', 'Editing will be available in a future update.');
  }, []);

  if (!expense) {
    return (
      <View className="flex-1 bg-cream dark:bg-dark-bg items-center justify-center">
        <Text className="text-base text-muted dark:text-muted-dark">Expense not found</Text>
      </View>
    );
  }

  const Icon = CATEGORY_ICONS[expense.category] ?? MoreHorizontal;
  const categoryLabel = CATEGORY_LABELS[expense.category] ?? 'Other';

  return (
    <View className="flex-1 bg-cream dark:bg-dark-bg">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-3 bg-white dark:bg-dark-card">
        <IconButton
          icon={<ArrowLeft size={22} color={colors.text} />}
          onPress={handleGoBack}
          accessibilityLabel="Go back"
          className="mr-3"
        />
        <Text className="text-xl font-bold text-text-primary dark:text-text-dark">
          Expense Details
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Badge */}
        <View className="items-center mb-6">
          <View className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mb-3">
            <Icon size={32} color={colors.primary[500]} />
          </View>
          <Badge label={categoryLabel} variant="primary" size="md" />
        </View>

        {/* Amount */}
        <View className="items-center mb-6">
          <Text className="text-4xl font-bold text-text-primary dark:text-text-dark">
            {formatCurrency(expense.amount, expense.currency)}
          </Text>
        </View>

        {/* Details Card */}
        <Card className="mb-4">
          {expense.description ? (
            <View className="mb-3">
              <Text className="text-xs text-muted dark:text-muted-dark mb-0.5">Description</Text>
              <Text className="text-base text-text-primary dark:text-text-dark">
                {expense.description}
              </Text>
            </View>
          ) : null}

          <View className="mb-3">
            <Text className="text-xs text-muted dark:text-muted-dark mb-0.5">Date</Text>
            <Text className="text-base text-text-primary dark:text-text-dark">
              {formatDate(expense.expenseDate)}
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-xs text-muted dark:text-muted-dark mb-0.5">Pet</Text>
            <Text className="text-base text-text-primary dark:text-text-dark">
              {petName}
            </Text>
          </View>

          {expense.notes ? (
            <View>
              <Text className="text-xs text-muted dark:text-muted-dark mb-0.5">Notes</Text>
              <Text className="text-base text-text-primary dark:text-text-dark">
                {expense.notes}
              </Text>
            </View>
          ) : null}
        </Card>

        {/* Receipt Photo */}
        {expense.receiptUri ? (
          <View className="mb-6">
            <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
              Receipt
            </Text>
            <Pressable
              onPress={handleOpenReceipt}
              accessibilityLabel="View receipt photo"
              accessibilityRole="button"
            >
              <Image
                source={{ uri: expense.receiptUri }}
                className="w-full h-48 rounded-xl"
                resizeMode="cover"
              />
            </Pressable>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-2">
          <View className="flex-1">
            <Button
              variant="outline"
              size="lg"
              onPress={handleEdit}
              accessibilityLabel="Edit expense"
              className="w-full"
            >
              Edit
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant="destructive"
              size="lg"
              onPress={handleDelete}
              accessibilityLabel="Delete expense"
              className="w-full"
            >
              Delete
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Receipt Full Screen Modal */}
      {expense.receiptUri ? (
        <RNModal
          visible={showReceiptModal}
          transparent
          animationType="fade"
          onRequestClose={handleCloseReceipt}
          statusBarTranslucent
        >
          <View className="flex-1 bg-black">
            <Pressable
              onPress={handleCloseReceipt}
              accessibilityLabel="Close receipt view"
              accessibilityRole="button"
              className="absolute top-14 right-4 z-10 w-10 h-10 rounded-full bg-black/50 items-center justify-center"
            >
              <X size={22} color="#FFFFFF" />
            </Pressable>
            <Image
              source={{ uri: expense.receiptUri }}
              className="flex-1"
              resizeMode="contain"
            />
          </View>
        </RNModal>
      ) : null}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
}
