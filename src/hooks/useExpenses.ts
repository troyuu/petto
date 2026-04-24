import { useExpenseStore } from '@/store/useExpenseStore';

export function useExpenses() {
  const expenses = useExpenseStore((state) => state.expenses);
  const isLoading = useExpenseStore((state) => state.isLoading);
  const loadExpenses = useExpenseStore((state) => state.loadExpenses);
  const loadByMonth = useExpenseStore((state) => state.loadByMonth);
  const addExpense = useExpenseStore((state) => state.addExpense);
  const updateExpense = useExpenseStore((state) => state.updateExpense);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const getMonthlySummary = useExpenseStore((state) => state.getMonthlySummary);
  const getCategorySummary = useExpenseStore((state) => state.getCategorySummary);

  return {
    expenses,
    isLoading,
    loadExpenses,
    loadByMonth,
    addExpense,
    updateExpense,
    deleteExpense,
    getMonthlySummary,
    getCategorySummary,
  };
}
