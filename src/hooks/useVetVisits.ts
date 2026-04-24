import { useVetStore } from '@/store/useVetStore';

export function useVetVisits() {
  const vetVisits = useVetStore((state) => state.vetVisits);
  const vaccinations = useVetStore((state) => state.vaccinations);
  const isLoading = useVetStore((state) => state.isLoading);
  const loadVetVisits = useVetStore((state) => state.loadVetVisits);
  const loadUpcomingVisits = useVetStore((state) => state.loadUpcomingVisits);
  const addVetVisit = useVetStore((state) => state.addVetVisit);
  const updateVetVisit = useVetStore((state) => state.updateVetVisit);
  const deleteVetVisit = useVetStore((state) => state.deleteVetVisit);
  const loadVaccinations = useVetStore((state) => state.loadVaccinations);
  const addVaccination = useVetStore((state) => state.addVaccination);
  const updateVaccination = useVetStore((state) => state.updateVaccination);
  const deleteVaccination = useVetStore((state) => state.deleteVaccination);

  return {
    vetVisits,
    vaccinations,
    isLoading,
    loadVetVisits,
    loadUpcomingVisits,
    addVetVisit,
    updateVetVisit,
    deleteVetVisit,
    loadVaccinations,
    addVaccination,
    updateVaccination,
    deleteVaccination,
  };
}
