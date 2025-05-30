import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_NOODLES_WITH_FILTERS } from "./queries";
import { NoodleItem } from "./components/NoodleItem";
import { FilterControls } from "./components/FilterControls";
import { Stack } from "expo-router";

export type FilterState = {
  spicinessLevel: number | null;
  originCountry: string | null;
};

export default function NoodleListScreen() {
  const [filters, setFilters] = useState<FilterState>({
    spicinessLevel: null,
    originCountry: null,
  });

  const { loading, error, data } = useQuery<{
    instantNoodles: {
      id: string;
      name: string;
      spicinessLevel: number;
      originCountry: string;
    }[];
  }>(GET_NOODLES_WITH_FILTERS);

  const filteredNoodles = useMemo(() => {
    if (!data?.instantNoodles) return [];

    return data.instantNoodles.filter((noodle) => {
      const matchesSpiciness = filters.spicinessLevel === null ||
        noodle.spicinessLevel === filters.spicinessLevel;

      const matchesCountry = filters.originCountry === null ||
        noodle.originCountry === filters.originCountry;

      return matchesSpiciness && matchesCountry;
    });
  }, [data?.instantNoodles, filters]);

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Noodles",
          headerRight: () => (
            <Text style={styles.headerButton}>♥</Text>
          )
        }}
      />

      <FilterControls
        filters={filters}
        onFiltersChange={setFilters}
        availableCountries={[...new Set(data?.instantNoodles?.map(n => n.originCountry) || [])]}
      />

      <FlatList
        data={filteredNoodles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoodleItem {...item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        ListEmptyComponent={
          <Text style={styles.emptyText}>No noodles match your filters</Text>
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
    color: "#666"
  },
  headerButton: {
    fontSize: 20,
    marginRight: 15,
    color: "#007AFF"
  }
});