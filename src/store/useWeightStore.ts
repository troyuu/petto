import { create } from 'zustand';
import * as weightRepository from '@/database/repositories/weightRepository';
import type { WeightEntry } from '@/utils/types';

interface WeightState {
  entries: WeightEntry[];
  isLoading: boolean;
}

interface WeightActions {
  loadEntries: (petId: string) => void;
  addEntry: (data: Omit<WeightEntry, 'id' | 'createdAt'>) => WeightEntry;
  deleteEntry: (id: string) => void;
  getLatest: (petId: string) => WeightEntry | null;
}

export const useWeightStore = create<WeightState & WeightActions>()((set) => ({
  entries: [],
  isLoading: false,

  loadEntries: (petId) => {
    try {
      set({ isLoading: true });
      const entries = weightRepository.getByPetId(petId);
      set({ entries, isLoading: false });
    } catch (error) {
      console.error('Failed to load weight entries:', error);
      set({ isLoading: false });
    }
  },

  addEntry: (data) => {
    try {
      const newEntry = weightRepository.create(data);
      set((state) => ({ entries: [newEntry, ...state.entries] }));
      return newEntry;
    } catch (error) {
      console.error('Failed to add weight entry:', error);
      throw error;
    }
  },

  deleteEntry: (id) => {
    try {
      weightRepository.remove(id);
      set((state) => ({
        entries: state.entries.filter((e) => e.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete weight entry:', error);
      throw error;
    }
  },

  getLatest: (petId) => {
    try {
      return weightRepository.getLatest(petId);
    } catch (error) {
      console.error('Failed to get latest weight:', error);
      return null;
    }
  },
}));
