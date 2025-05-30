import { create } from 'zustand';

interface FiltersState {
  spicinessLevel: number | null;
  originCountry: string | null;
  setSpicinessLevel: (level: number | null) => void;
  setOriginCountry: (country: string | null) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FiltersState>()((set) => ({
  spicinessLevel: null,
  originCountry: null,
  setSpicinessLevel: (level) => set({ spicinessLevel: level }),
  setOriginCountry: (country) => set({ originCountry: country }),
  clearFilters: () => set({ spicinessLevel: null, originCountry: null }),
})); 