import { useFeedingStore } from '@/store/useFeedingStore';

export function useFeedings() {
  const feedings = useFeedingStore((state) => state.feedings);
  const isLoading = useFeedingStore((state) => state.isLoading);
  const loadFeedings = useFeedingStore((state) => state.loadFeedings);
  const loadTodayFeedings = useFeedingStore((state) => state.loadTodayFeedings);
  const addFeeding = useFeedingStore((state) => state.addFeeding);
  const updateFeeding = useFeedingStore((state) => state.updateFeeding);
  const deleteFeeding = useFeedingStore((state) => state.deleteFeeding);

  return {
    feedings,
    isLoading,
    loadFeedings,
    loadTodayFeedings,
    addFeeding,
    updateFeeding,
    deleteFeeding,
  };
}
