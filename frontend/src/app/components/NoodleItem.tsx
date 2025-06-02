import React from 'react';
import { View, Text, Button } from 'react-native';
import { useFavourites } from '../../utility/FavouritesContext';

export function NoodleItem({ id, name }: { id: string; name: string }) {
  const { favourites, addFavourite, removeFavourite } = useFavourites();
  const isFav = favourites.includes(id);

  return (
    <View>
      <Text>{name}</Text>
      <Button
        title={isFav ? 'Remove Favourite' : 'Add Favourite'}
        onPress={() => (isFav ? removeFavourite(id) : addFavourite(id))}
      />
    </View>
  );
}