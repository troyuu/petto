import { useMedicationStore } from '@/store/useMedicationStore';

export function useMedications() {
  const medications = useMedicationStore((state) => state.medications);
  const medicationLogs = useMedicationStore((state) => state.medicationLogs);
  const isLoading = useMedicationStore((state) => state.isLoading);
  const loadMedications = useMedicationStore((state) => state.loadMedications);
  const loadActiveMedications = useMedicationStore((state) => state.loadActiveMedications);
  const addMedication = useMedicationStore((state) => state.addMedication);
  const updateMedication = useMedicationStore((state) => state.updateMedication);
  const deactivateMedication = useMedicationStore((state) => state.deactivateMedication);
  const loadTodaysLogs = useMedicationStore((state) => state.loadTodaysLogs);
  const logDose = useMedicationStore((state) => state.logDose);

  return {
    medications,
    medicationLogs,
    isLoading,
    loadMedications,
    loadActiveMedications,
    addMedication,
    updateMedication,
    deactivateMedication,
    loadTodaysLogs,
    logDose,
  };
}
