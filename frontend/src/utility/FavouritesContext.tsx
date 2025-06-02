import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getFavourites, saveFavourites } from '../utility/favouritesStorage';

interface FavouritesContextProps {
  favourites: string[];
  addFavourite: (id: string) => void;
  removeFavourite: (id: string) => void;
}

const FavouritesContext = createContext<FavouritesContextProps | undefined>(undefined);

interface FavouritesProviderProps {
  children: ReactNode;
}

export const FavouritesProvider = ({ children }: FavouritesProviderProps) => {
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const saved = await getFavourites();
      setFavourites(saved);
    })();
  }, []);

  useEffect(() => {
    saveFavourites(favourites);
  }, [favourites]);

  const addFavourite = (id: string) => {
    setFavourites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFavourite = (id: string) => {
    setFavourites((prev) => prev.filter((fav) => fav !== id));
  };

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) throw new Error('useFavourites must be used within FavouritesProvider');
  return context;
};
