import { useMemo } from 'react';
import { usePetStore } from '@/store/usePetStore';

export function usePets() {
  const pets = usePetStore((state) => state.pets);
  const selectedPetId = usePetStore((state) => state.selectedPetId);
  const isLoading = usePetStore((state) => state.isLoading);
  const loadPets = usePetStore((state) => state.loadPets);
  const addPet = usePetStore((state) => state.addPet);
  const updatePet = usePetStore((state) => state.updatePet);
  const deletePet = usePetStore((state) => state.deletePet);
  const selectPet = usePetStore((state) => state.selectPet);

  const selectedPet = useMemo(
    () => pets.find((p) => p.id === selectedPetId) ?? null,
    [pets, selectedPetId],
  );

  return {
    pets,
    selectedPetId,
    selectedPet,
    isLoading,
    loadPets,
    addPet,
    updatePet,
    deletePet,
    selectPet,
  };
}
