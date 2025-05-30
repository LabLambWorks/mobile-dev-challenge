import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesState {
  favoriteIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

type FavoritesStateV1 = {
  version: 1;
  state: {
    favoriteIds: string[];
  };
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      addFavorite: (id: string) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds
            : [...state.favoriteIds, id],
        })),
      removeFavorite: (id: string) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((favId) => favId !== id),
        })),
      isFavorite: (id: string) => get().favoriteIds.includes(id),
      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState: unknown) => {
        // If no state exists, return default state
        if (!persistedState) {
          return { favoriteIds: [] };
        }

        // Handle migration from unversioned state
        if (typeof persistedState === "object" && persistedState !== null) {
          const state = persistedState as any;
          // If it's already in the correct format
          if (Array.isArray(state.favoriteIds)) {
            return state;
          }
          // If it's in the old format
          if (Array.isArray(state.state?.favoriteIds)) {
            return { favoriteIds: state.state.favoriteIds };
          }
        }

        // Default fallback
        return { favoriteIds: [] };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure favoriteIds is always an array
          if (!Array.isArray(state.favoriteIds)) {
            state.favoriteIds = [];
          }
        }
      },
    }
  )
);
