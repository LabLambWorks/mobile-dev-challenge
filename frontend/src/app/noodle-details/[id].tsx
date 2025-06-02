import React from 'react';
import { View, Text, Button } from 'react-native';
import { useFavourites } from '../../utility/FavouritesContext';

export function NoodleDetail({ noodle }: { noodle: { id: string; name: string; [key: string]: any } }) {
  const { favourites, addFavourite, removeFavourite } = useFavourites();

  const isFav = favourites.includes(noodle.id);

  const toggleFavourite = () => {
    if (isFav) removeFavourite(noodle.id);
    else addFavourite(noodle.id);
  };

  return (
    <View>
      <Text>{noodle.name}</Text>
      {/* Other noodle details */}
      <Button
        title={isFav ? 'Remove from Favourites' : 'Add to Favourites'}
        onPress={toggleFavourite}
      />
    </View>
  );
}
