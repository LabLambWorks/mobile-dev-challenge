import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_NOODLES } from '../queries';
import { NoodleItem } from '../components/NoodleItem';
import { useFavourites } from '../../utility/FavouritesContext';

export default function FavouritesScreen() {
  const { favourites } = useFavourites();
  const { loading, error, data } = useQuery(GET_NOODLES);

  if (loading) return <Text>Loading favourites...</Text>;
  if (error) return <Text>Error loading favourites: {error.message}</Text>;

  // Filter noodles to only favourites
  const favouriteNoodles = data?.instantNoodles.filter((n: any) => favourites.includes(n.id)) || [];

  return (
    <View style={styles.container}>
      {favouriteNoodles.length === 0 ? (
        <Text style={styles.empty}>No favourites yet.</Text>
      ) : (
        <FlatList
          data={favouriteNoodles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoodleItem {...item} />}
          numColumns={1}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, color: 'gray' },
});
