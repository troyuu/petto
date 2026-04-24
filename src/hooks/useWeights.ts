import { useWeightStore } from '@/store/useWeightStore';

export function useWeights() {
  const entries = useWeightStore((state) => state.entries);
  const isLoading = useWeightStore((state) => state.isLoading);
  const loadEntries = useWeightStore((state) => state.loadEntries);
  const addEntry = useWeightStore((state) => state.addEntry);
  const deleteEntry = useWeightStore((state) => state.deleteEntry);

  return {
    entries,
    isLoading,
    loadEntries,
    addEntry,
    deleteEntry,
  };
}
