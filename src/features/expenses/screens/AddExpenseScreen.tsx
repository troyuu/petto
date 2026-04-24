import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import dayjs from 'dayjs';

import { usePets } from '@/hooks/usePets';
import { useExpenses } from '@/hooks/useExpenses';
import { useAppStore } from '@/store/useAppStore';
import { PetAvatar, CategoryPicker, PhotoPicker } from '@/components/shared';
import { Button, Input, DatePicker, IconButton } from '@/components/ui';
import { toCentavos } from '@/utils/formatters';
import { colors } from '@/utils/colors';
import { EXPENSE_CATEGORIES } from '@/utils/constants';
import type { ExpenseStackParamList } from '@/app/navigation/types';
import type { ExpenseCategory } from '@/utils/types';

type NavigationProp = NativeStackNavigationProp<ExpenseStackParamList, 'AddExpense'>;
type AddExpenseRouteProp = RouteProp<ExpenseStackParamList, 'AddExpense'>;

export default function AddExpenseScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddExpenseRouteProp>();
  const { pets, selectedPetId } = usePets();
  const { addExpense } = useExpenses();
  const currencySymbol = useAppStore((state) => state.currencySymbol);

  const initialPetId = route.params?.petId ?? selectedPetId ?? pets[0]?.id ?? '';
  const [petId, setPetId] = useState<string>(initialPetId);
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [amountText, setAmountText] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<string>('');
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectPet = useCallback((id: string) => {
    setPetId(id);
  }, []);

  const handleCategorySelect = useCallback((value: string) => {
    setCategory(value as ExpenseCategory);
  }, []);

  const handlePhotoSelected = useCallback((uri: string) => {
    setReceiptUri(uri);
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setReceiptUri(null);
  }, []);

  const handleSave = useCallback(() => {
    const amount = parseFloat(amountText);

    if (!petId) {
      Alert.alert('Error', 'Please select a pet.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    setIsSaving(true);
    try {
      addExpense({
        petId,
        category,
        amount: toCentavos(amount),
        currency: currencySymbol,
        description: description.trim() || null,
        expenseDate: dayjs(date).toISOString(),
        notes: notes.trim() || null,
        receiptUri,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save expense.');
      setIsSaving(false);
    }
  }, [petId, category, amountText, description, date, notes, receiptUri, currencySymbol, addExpense, navigation]);

  const isValid = petId.length > 0 && amountText.length > 0 && !isNaN(parseFloat(amountText));

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
          Add Expense
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Pet Selector */}
        {pets.length > 1 && (
          <View className="mb-5">
            <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
              Select Pet
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pets.map((pet) => {
                const isSelected = pet.id === petId;
                return (
                  <Pressable
                    key={pet.id}
                    onPress={() => handleSelectPet(pet.id)}
                    accessibilityLabel={`Select ${pet.name}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    className={`items-center mr-3 px-3 py-2 rounded-xl ${
                      isSelected
                        ? 'bg-primary-100 dark:bg-primary-900 border border-primary-500'
                        : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700'
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
                    >
                      {pet.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Category Picker */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
            Category
          </Text>
          <CategoryPicker
            categories={EXPENSE_CATEGORIES}
            selectedValue={category}
            onSelect={handleCategorySelect}
          />
        </View>

        {/* Amount Input */}
        <View className="mb-5">
          <Input
            label="Amount"
            value={amountText}
            onChangeText={setAmountText}
            placeholder="0.00"
            keyboardType="decimal-pad"
            leftIcon={
              <Text className="text-base font-semibold text-text-primary dark:text-text-dark">
                {currencySymbol}
              </Text>
            }
            accessibilityLabel="Expense amount"
            accessibilityHint="Enter the expense amount"
          />
        </View>

        {/* Description */}
        <View className="mb-5">
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="What was this expense for?"
            accessibilityLabel="Expense description"
          />
        </View>

        {/* Date Picker */}
        <View className="mb-5">
          <DatePicker
            label="Date"
            value={date}
            onChange={setDate}
            mode="date"
            maximumDate={new Date()}
            accessibilityLabel="Expense date"
          />
        </View>

        {/* Notes */}
        <View className="mb-5">
          <Input
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Any additional notes..."
            multiline
            accessibilityLabel="Notes"
          />
        </View>

        {/* Receipt Photo */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-2">
            Receipt (optional)
          </Text>
          <PhotoPicker
            photoUri={receiptUri}
            onPhotoSelected={handlePhotoSelected}
            onRemove={handleRemovePhoto}
            label="Add Receipt Photo"
            className="w-32 h-32"
          />
        </View>

        {/* Save Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleSave}
          disabled={!isValid}
          loading={isSaving}
          accessibilityLabel="Save expense"
          className="w-full"
        >
          Save Expense
        </Button>
      </ScrollView>
    </View>
  );
}
