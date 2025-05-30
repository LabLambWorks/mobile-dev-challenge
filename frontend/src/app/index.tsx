import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_NOODLES } from "./queries";
import { NoodleItem } from "./components/NoodleItem";
import { NoodleFilters } from "./components/NoodleFilters";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Noodle = {
  id: string;
  name: string;
  spicinessLevel: number;
  originCountry: string;
  imageURL?: string;
};

export default function NoodleListScreen() {
  const [spicinessLevel, setSpicinessLevel] = useState<number | null>(null);
  const [originCountry, setOriginCountry] = useState<string | null>(null);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const openFilters = useCallback(() => {
    setIsFiltersVisible(true);
  }, []);

  const closeFilters = useCallback(() => {
    setIsFiltersVisible(false);
  }, []);

  const { loading, error, data } = useQuery<{ instantNoodles: Noodle[] }>(
    GET_NOODLES,
    {
      variables: {
        where: {
          ...(spicinessLevel && { spicinessLevel: { equals: spicinessLevel } }),
          ...(originCountry && { originCountry: { equals: originCountry } }),
        },
      },
    }
  );

  const activeFiltersCount = (spicinessLevel ? 1 : 0) + (originCountry ? 1 : 0);

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Noodles",
          headerRight: () => (
            <Pressable onPress={openFilters}>
              <Ionicons name="filter-outline" size={24} color="#000" />
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={data?.instantNoodles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoodleItem {...item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
      />

      <NoodleFilters
        isVisible={isFiltersVisible}
        onClose={closeFilters}
        spicinessLevel={spicinessLevel}
        originCountry={originCountry}
        onSpicinessChange={setSpicinessLevel}
        onCountryChange={setOriginCountry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    padding: 16,
  },
  filterButton: {
    padding: 8,
    marginRight: 8,
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#000",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
