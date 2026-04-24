import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/store/mmkvStorage';
import * as petRepository from '@/database/repositories/petRepository';
import type { Pet } from '@/utils/types';

interface PetState {
  pets: Pet[];
  selectedPetId: string | null;
  isLoading: boolean;
}

interface PetActions {
  loadPets: () => void;
  addPet: (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => Pet;
  updatePet: (id: string, data: Partial<Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>>) => Pet | null;
  deletePet: (id: string) => void;
  selectPet: (id: string | null) => void;
}

export const usePetStore = create<PetState & PetActions>()(
  persist(
    (set, get) => ({
      pets: [],
      selectedPetId: null,
      isLoading: false,

      loadPets: () => {
        try {
          set({ isLoading: true });
          const pets = petRepository.getAll();
          set({ pets, isLoading: false });
        } catch (error) {
          console.error('Failed to load pets:', error);
          set({ isLoading: false });
        }
      },

      addPet: (data) => {
        try {
          const newPet = petRepository.create(data);
          set((state) => ({ pets: [...state.pets, newPet] }));

          // Auto-select if this is the first pet
          if (get().selectedPetId === null) {
            set({ selectedPetId: newPet.id });
          }

          return newPet;
        } catch (error) {
          console.error('Failed to add pet:', error);
          throw error;
        }
      },

      updatePet: (id, data) => {
        try {
          const updated = petRepository.update(id, data);
          if (updated) {
            set((state) => ({
              pets: state.pets.map((p) => (p.id === id ? updated : p)),
            }));
          }
          return updated;
        } catch (error) {
          console.error('Failed to update pet:', error);
          throw error;
        }
      },

      deletePet: (id) => {
        try {
          petRepository.remove(id);
          set((state) => {
            const updatedPets = state.pets.filter((p) => p.id !== id);
            const newSelectedId =
              state.selectedPetId === id
                ? updatedPets.length > 0
                  ? updatedPets[0].id
                  : null
                : state.selectedPetId;
            return { pets: updatedPets, selectedPetId: newSelectedId };
          });
        } catch (error) {
          console.error('Failed to delete pet:', error);
          throw error;
        }
      },

      selectPet: (id) => {
        set({ selectedPetId: id });
      },
    }),
    {
      name: 'pet-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ selectedPetId: state.selectedPetId }),
    },
  ),
);
