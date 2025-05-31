import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FavouritesStorage } from '../../utils/FavouritesStorage';

export type FilterState = {
  spicinessLevel: number | null;
  originCountry: string | null;
};

type FavouritesContextType = {
  favourites: string[];
  addFavourite: (noodleId: string) => Promise<void>;
  removeFavourite: (noodleId: string) => Promise<void>;
  isFavourite: (noodleId: string) => boolean;
  sharedFilters: FilterState;
  setSharedFilters: (filters: FilterState) => void;
};

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [sharedFilters, setSharedFilters] = useState<FilterState>({
    spicinessLevel: null,
    originCountry: null,
  });

  useEffect(() => {
    loadFavourites();
  }, []);

  const loadFavourites = async () => {
    const savedFavourites = await FavouritesStorage.getFavourites();
    setFavourites(savedFavourites);
  };

  const addFavourite = async (noodleId: string) => {
    try {
      await FavouritesStorage.addFavourite(noodleId);
      setFavourites(prev => [...prev.filter(id => id !== noodleId), noodleId]);
    } catch (error) {
      throw error;
    }
  };

  const removeFavourite = async (noodleId: string) => {
    try {
      await FavouritesStorage.removeFavourite(noodleId);
      setFavourites(prev => prev.filter(id => id !== noodleId));
    } catch (error) {
      throw error;
    }
  };

  const isFavourite = (noodleId: string) => {
    return favourites.includes(noodleId);
  };

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        addFavourite,
        removeFavourite,
        isFavourite,
        sharedFilters,
        setSharedFilters,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
}