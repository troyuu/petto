import { create } from 'zustand';
import * as vetVisitRepository from '@/database/repositories/vetVisitRepository';
import * as vaccinationRepository from '@/database/repositories/vaccinationRepository';
import type { VetVisit, Vaccination } from '@/utils/types';

interface VetState {
  vetVisits: VetVisit[];
  vaccinations: Vaccination[];
  isLoading: boolean;
}

interface VetActions {
  loadVetVisits: (petId: string) => void;
  loadUpcomingVisits: (petId?: string) => void;
  addVetVisit: (data: Omit<VetVisit, 'id' | 'createdAt' | 'updatedAt'>) => VetVisit;
  updateVetVisit: (id: string, data: Partial<Omit<VetVisit, 'id' | 'createdAt' | 'updatedAt'>>) => VetVisit | null;
  deleteVetVisit: (id: string) => void;
  loadVaccinations: (petId: string) => void;
  addVaccination: (data: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt'>) => Vaccination;
  updateVaccination: (id: string, data: Partial<Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt'>>) => Vaccination | null;
  deleteVaccination: (id: string) => void;
}

export const useVetStore = create<VetState & VetActions>()((set) => ({
  vetVisits: [],
  vaccinations: [],
  isLoading: false,

  loadVetVisits: (petId) => {
    try {
      set({ isLoading: true });
      const vetVisits = vetVisitRepository.getByPetId(petId);
      set({ vetVisits, isLoading: false });
    } catch (error) {
      console.error('Failed to load vet visits:', error);
      set({ isLoading: false });
    }
  },

  loadUpcomingVisits: (petId?) => {
    try {
      set({ isLoading: true });
      const vetVisits = vetVisitRepository.getUpcoming(petId);
      set({ vetVisits, isLoading: false });
    } catch (error) {
      console.error('Failed to load upcoming visits:', error);
      set({ isLoading: false });
    }
  },

  addVetVisit: (data) => {
    try {
      const newVisit = vetVisitRepository.create(data);
      set((state) => ({ vetVisits: [newVisit, ...state.vetVisits] }));
      return newVisit;
    } catch (error) {
      console.error('Failed to add vet visit:', error);
      throw error;
    }
  },

  updateVetVisit: (id, data) => {
    try {
      const updated = vetVisitRepository.update(id, data);
      if (updated) {
        set((state) => ({
          vetVisits: state.vetVisits.map((v) => (v.id === id ? updated : v)),
        }));
      }
      return updated;
    } catch (error) {
      console.error('Failed to update vet visit:', error);
      throw error;
    }
  },

  deleteVetVisit: (id) => {
    try {
      vetVisitRepository.remove(id);
      set((state) => ({
        vetVisits: state.vetVisits.filter((v) => v.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete vet visit:', error);
      throw error;
    }
  },

  loadVaccinations: (petId) => {
    try {
      set({ isLoading: true });
      const vaccinations = vaccinationRepository.getByPetId(petId);
      set({ vaccinations, isLoading: false });
    } catch (error) {
      console.error('Failed to load vaccinations:', error);
      set({ isLoading: false });
    }
  },

  addVaccination: (data) => {
    try {
      const newVacc = vaccinationRepository.create(data);
      set((state) => ({ vaccinations: [newVacc, ...state.vaccinations] }));
      return newVacc;
    } catch (error) {
      console.error('Failed to add vaccination:', error);
      throw error;
    }
  },

  updateVaccination: (id, data) => {
    try {
      const updated = vaccinationRepository.update(id, data);
      if (updated) {
        set((state) => ({
          vaccinations: state.vaccinations.map((v) => (v.id === id ? updated : v)),
        }));
      }
      return updated;
    } catch (error) {
      console.error('Failed to update vaccination:', error);
      throw error;
    }
  },

  deleteVaccination: (id) => {
    try {
      vaccinationRepository.remove(id);
      set((state) => ({
        vaccinations: state.vaccinations.filter((v) => v.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete vaccination:', error);
      throw error;
    }
  },
}));
