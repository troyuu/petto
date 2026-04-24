import { create } from 'zustand';
import * as medicationRepository from '@/database/repositories/medicationRepository';
import * as medicationLogRepository from '@/database/repositories/medicationLogRepository';
import type { Medication, MedicationLog, MedicationLogStatus } from '@/utils/types';

interface MedicationState {
  medications: Medication[];
  medicationLogs: MedicationLog[];
  isLoading: boolean;
}

interface MedicationActions {
  loadMedications: (petId: string) => void;
  loadActiveMedications: (petId: string) => void;
  addMedication: (data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => Medication;
  updateMedication: (id: string, data: Partial<Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>>) => Medication | null;
  deactivateMedication: (id: string) => void;
  loadTodaysLogs: (petId: string) => void;
  logDose: (medicationId: string, petId: string, status: MedicationLogStatus) => MedicationLog;
}

export const useMedicationStore = create<MedicationState & MedicationActions>()((set) => ({
  medications: [],
  medicationLogs: [],
  isLoading: false,

  loadMedications: (petId) => {
    try {
      set({ isLoading: true });
      const medications = medicationRepository.getByPetId(petId);
      set({ medications, isLoading: false });
    } catch (error) {
      console.error('Failed to load medications:', error);
      set({ isLoading: false });
    }
  },

  loadActiveMedications: (petId) => {
    try {
      set({ isLoading: true });
      const medications = medicationRepository.getActiveByPetId(petId);
      set({ medications, isLoading: false });
    } catch (error) {
      console.error('Failed to load active medications:', error);
      set({ isLoading: false });
    }
  },

  addMedication: (data) => {
    try {
      const newMedication = medicationRepository.create(data);
      set((state) => ({ medications: [...state.medications, newMedication] }));
      return newMedication;
    } catch (error) {
      console.error('Failed to add medication:', error);
      throw error;
    }
  },

  updateMedication: (id, data) => {
    try {
      const updated = medicationRepository.update(id, data);
      if (updated) {
        set((state) => ({
          medications: state.medications.map((m) => (m.id === id ? updated : m)),
        }));
      }
      return updated;
    } catch (error) {
      console.error('Failed to update medication:', error);
      throw error;
    }
  },

  deactivateMedication: (id) => {
    try {
      const updated = medicationRepository.update(id, { isActive: false });
      if (updated) {
        set((state) => ({
          medications: state.medications.map((m) => (m.id === id ? updated : m)),
        }));
      }
    } catch (error) {
      console.error('Failed to deactivate medication:', error);
      throw error;
    }
  },

  loadTodaysLogs: (petId) => {
    try {
      set({ isLoading: true });
      const logs = medicationLogRepository.getTodayByPetId(petId);
      set({ medicationLogs: logs, isLoading: false });
    } catch (error) {
      console.error('Failed to load today logs:', error);
      set({ isLoading: false });
    }
  },

  logDose: (medicationId, petId, status) => {
    try {
      const log = medicationLogRepository.logDose(medicationId, petId, status);
      set((state) => ({ medicationLogs: [...state.medicationLogs, log] }));
      return log;
    } catch (error) {
      console.error('Failed to log dose:', error);
      throw error;
    }
  },
}));
