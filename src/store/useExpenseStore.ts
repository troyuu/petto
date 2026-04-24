import { create } from 'zustand';
import * as expenseRepository from '@/database/repositories/expenseRepository';
import type {
  MonthlySummary,
  CategorySummary,
} from '@/database/repositories/expenseRepository';
import type { Expense } from '@/utils/types';

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
}

interface ExpenseActions {
  loadExpenses: (petId: string) => void;
  loadByMonth: (petId: string, year: number, month: number) => void;
  addExpense: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Expense;
  updateExpense: (id: string, data: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => Expense | null;
  deleteExpense: (id: string) => void;
  getMonthlySummary: (petId: string, year: number, month: number) => MonthlySummary;
  getCategorySummary: (petId: string, year: number, month: number) => CategorySummary[];
}

export const useExpenseStore = create<ExpenseState & ExpenseActions>()((set) => ({
  expenses: [],
  isLoading: false,

  loadExpenses: (petId) => {
    try {
      set({ isLoading: true });
      const expenses = expenseRepository.getByPetId(petId);
      set({ expenses, isLoading: false });
    } catch (error) {
      console.error('Failed to load expenses:', error);
      set({ isLoading: false });
    }
  },

  loadByMonth: (petId, year, month) => {
    try {
      set({ isLoading: true });
      const expenses = expenseRepository.getByMonth(petId, year, month);
      set({ expenses, isLoading: false });
    } catch (error) {
      console.error('Failed to load expenses by month:', error);
      set({ isLoading: false });
    }
  },

  addExpense: (data) => {
    try {
      const newExpense = expenseRepository.create(data);
      set((state) => ({ expenses: [newExpense, ...state.expenses] }));
      return newExpense;
    } catch (error) {
      console.error('Failed to add expense:', error);
      throw error;
    }
  },

  updateExpense: (id, data) => {
    try {
      const updated = expenseRepository.update(id, data);
      if (updated) {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? updated : e)),
        }));
      }
      return updated;
    } catch (error) {
      console.error('Failed to update expense:', error);
      throw error;
    }
  },

  deleteExpense: (id) => {
    try {
      expenseRepository.remove(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete expense:', error);
      throw error;
    }
  },

  getMonthlySummary: (petId, year, month) => {
    try {
      return expenseRepository.getMonthlySummary(petId, year, month);
    } catch (error) {
      console.error('Failed to get monthly summary:', error);
      return { totalAmount: 0, count: 0, currency: 'PHP' };
    }
  },

  getCategorySummary: (petId, year, month) => {
    try {
      return expenseRepository.getCategorySummary(petId, year, month);
    } catch (error) {
      console.error('Failed to get category summary:', error);
      return [];
    }
  },
}));
