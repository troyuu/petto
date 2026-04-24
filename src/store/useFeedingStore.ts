import { create } from 'zustand';
import * as feedingRepository from '@/database/repositories/feedingRepository';
import type { Feeding } from '@/utils/types';

interface FeedingState {
  feedings: Feeding[];
  isLoading: boolean;
}

interface FeedingActions {
  loadFeedings: (petId: string) => void;
  loadTodayFeedings: (petId: string) => void;
  addFeeding: (data: Omit<Feeding, 'id' | 'createdAt' | 'updatedAt'>) => Feeding;
  updateFeeding: (id: string, data: Partial<Omit<Feeding, 'id' | 'createdAt' | 'updatedAt'>>) => Feeding | null;
  deleteFeeding: (id: string) => void;
}

export const useFeedingStore = create<FeedingState & FeedingActions>()((set) => ({
  feedings: [],
  isLoading: false,

  loadFeedings: (petId) => {
    try {
      set({ isLoading: true });
      const feedings = feedingRepository.getByPetId(petId);
      set({ feedings, isLoading: false });
    } catch (error) {
      console.error('Failed to load feedings:', error);
      set({ isLoading: false });
    }
  },

  loadTodayFeedings: (petId) => {
    try {
      set({ isLoading: true });
      const feedings = feedingRepository.getTodayByPet(petId);
      set({ feedings, isLoading: false });
    } catch (error) {
      console.error('Failed to load today feedings:', error);
      set({ isLoading: false });
    }
  },

  addFeeding: (data) => {
    try {
      const newFeeding = feedingRepository.create(data);
      set((state) => ({ feedings: [newFeeding, ...state.feedings] }));
      return newFeeding;
    } catch (error) {
      console.error('Failed to add feeding:', error);
      throw error;
    }
  },

  updateFeeding: (id, data) => {
    try {
      const updated = feedingRepository.update(id, data);
      if (updated) {
        set((state) => ({
          feedings: state.feedings.map((f) => (f.id === id ? updated : f)),
        }));
      }
      return updated;
    } catch (error) {
      console.error('Failed to update feeding:', error);
      throw error;
    }
  },

  deleteFeeding: (id) => {
    try {
      feedingRepository.remove(id);
      set((state) => ({
        feedings: state.feedings.filter((f) => f.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete feeding:', error);
      throw error;
    }
  },
}));
