import React, { useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_NOODLES_WITH_FILTERS } from "../queries";
import { NoodleItem } from "../components/NoodleItem";
import { FilterControls } from "../components/FilterControls";
import { Stack } from "expo-router";
import { useFavourites } from "../contexts/FavouritesContext";

export default function FavouritesScreen() {
  const { favourites, sharedFilters, setSharedFilters, removeFavourite } = useFavourites();

  const { loading, error, data } = useQuery<{
    instantNoodles: { 
      id: string; 
      name: string; 
      spicinessLevel: number;
      originCountry: string;
    }[];
  }>(GET_NOODLES_WITH_FILTERS);

  const filteredFavouriteNoodles = useMemo(() => {
    if (!data?.instantNoodles) return [];
    
    // First filter by favourites, then by other filters
    const favouriteNoodles = data.instantNoodles.filter(noodle => 
      favourites.includes(noodle.id)
    );
    
    return favouriteNoodles.filter((noodle) => {
      const matchesSpiciness = sharedFilters.spicinessLevel === null || 
        noodle.spicinessLevel === sharedFilters.spicinessLevel;
      
      const matchesCountry = sharedFilters.originCountry === null || 
        noodle.originCountry === sharedFilters.originCountry;
      
      return matchesSpiciness && matchesCountry;
    });
  }, [data?.instantNoodles, favourites, sharedFilters]);

  const handleRemoveFavourite = async (noodleId: string) => {
    try {
      await removeFavourite(noodleId);
    } catch (error) {
      console.error('Failed to remove favourite:', error);
    }
  };

  const renderFavouriteItem = ({ item }: { item: any }) => (
    <View style={styles.favouriteItemContainer}>
      <View style={styles.noodleItemWrapper}>
        <NoodleItem {...item} />
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavourite(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "My Favourites" }} />
      
      <FilterControls 
        filters={sharedFilters}
        onFiltersChange={setSharedFilters}
        availableCountries={[...new Set(data?.instantNoodles?.map(n => n.originCountry) || [])]}
      />
      
      <FlatList
        data={filteredFavouriteNoodles}
        keyExtractor={(item) => item.id}
        renderItem={renderFavouriteItem}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {favourites.length === 0 
              ? "No favourite noodles yet. Add some from the main list!" 
              : "No favourite noodles match your filters"
            }
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", padding: 16 },
  emptyText: { 
    textAlign: "center", 
    marginTop: 40, 
    fontSize: 16, 
    color: "#666",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  favouriteItemContainer: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noodleItemWrapper: {
    height: 200,
  },
  removeButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontWeight: "600",
  },
});