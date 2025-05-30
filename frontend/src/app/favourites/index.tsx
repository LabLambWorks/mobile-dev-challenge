import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_NOODLES } from "../queries";
import { useFavoritesStore } from "../store/favorites";
import { NoodleItem } from "../components/NoodleItem";
import { FilterControls } from "../components/FilterControls";
import { useFilterStore } from "../store/filters";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale, scale } from "react-native-size-matters";

export default function FavoritesScreen() {
  const { favoriteIds } = useFavoritesStore();
  const { spicinessLevel, originCountry } = useFilterStore();

  const { loading, error, data } = useQuery(GET_NOODLES, {
    variables: {
      where: {
        id: { in: favoriteIds },
        ...(spicinessLevel ? { spicinessLevel } : {}),
        ...(originCountry ? { originCountry } : {}),
      },
    },
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading favorites</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  const noodles = data?.instantNoodles || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: "Favorites",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <FilterControls />
      {noodles.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Add some noodles to your favorites to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={noodles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoodleItem id={item.id} name={item.name} />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: scale(16),
  },
  errorText: {
    fontSize: moderateScale(18),
    color: "#e74c3c",
    marginBottom: scale(8),
  },
  errorDetail: {
    fontSize: moderateScale(14),
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(32),
  },
  emptyText: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    color: "#333",
    marginTop: scale(16),
  },
  emptySubtext: {
    fontSize: moderateScale(16),
    color: "#666",
    textAlign: "center",
    marginTop: scale(8),
  },
});
