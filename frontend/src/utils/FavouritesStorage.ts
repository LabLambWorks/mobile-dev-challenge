import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = 'instant_noodles_favourites';

export class FavouritesStorage {
  static async getFavourites(): Promise<string[]> {
    try {
      const favourites = await AsyncStorage.getItem(FAVOURITES_KEY);
      return favourites ? JSON.parse(favourites) : [];
    } catch (error) {
      console.error('Failed to load favourites:', error);
      return [];
    }
  }

  static async addFavourite(noodleId: string): Promise<void> {
    try {
      const currentFavourites = await this.getFavourites();
      if (!currentFavourites.includes(noodleId)) {
        const updatedFavourites = [...currentFavourites, noodleId];
        await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updatedFavourites));
      }
    } catch (error) {
      console.error('Failed to add favourite:', error);
      throw error;
    }
  }

  static async removeFavourite(noodleId: string): Promise<void> {
    try {
      const currentFavourites = await this.getFavourites();
      const updatedFavourites = currentFavourites.filter(id => id !== noodleId);
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updatedFavourites));
    } catch (error) {
      console.error('Failed to remove favourite:', error);
      throw error;
    }
  }

  static async isFavourite(noodleId: string): Promise<boolean> {
    try {
      const favourites = await this.getFavourites();
      return favourites.includes(noodleId);
    } catch (error) {
      console.error('Failed to check favourite status:', error);
      return false;
    }
  }
}