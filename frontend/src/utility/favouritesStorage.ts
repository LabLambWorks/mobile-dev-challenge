import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = 'favourites';

export const getFavourites = async (): Promise<string[]> => {
  const json = await AsyncStorage.getItem(FAVOURITES_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveFavourites = async (ids: string[]) => {
  await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(ids));
};
