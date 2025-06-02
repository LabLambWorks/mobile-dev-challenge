import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_NOODLES } from "./queries";
import { NoodleItem } from "./components/NoodleItem";
import { Stack } from "expo-router";

// Origin country options matching your backend enums
const ORIGIN_COUNTRIES = [
  { label: "Japan", value: "japan" },
  { label: "South Korea", value: "south_korea" },
  { label: "China", value: "china" },
  { label: "Thailand", value: "thailand" },
  { label: "Vietnam", value: "vietnam" },
  { label: "Indonesia", value: "indonesia" },
  { label: "Malaysia", value: "malaysia" },
  { label: "Singapore", value: "singapore" },
  { label: "Taiwan", value: "taiwan" },
  { label: "Philippines", value: "philippines" },
];

export default function NoodleListScreen() {
  const [spicinessLevel, setSpicinessLevel] = useState<string>("");
  const [originCountry, setOriginCountry] = useState<string>("");

const filters = [];
if (spicinessLevel.trim() !== "") {
  filters.push({ spicinessLevel: { equals: Number(spicinessLevel) } });
}
if (originCountry.trim() !== "") {
  filters.push({ originCountry: { equals: originCountry } });
}

const variables = filters.length > 0 ? { where: { AND: filters } } : {};
console.log("Filters:", filters);
console.log("Variables:", variables);

  const { loading, error, data } = useQuery<{
    instantNoodles: { id: string; name: string; spicinessLevel: number; originCountry: string }[];
  }>(GET_NOODLES, { variables });


  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Noodles" }} />

      {/* Filters */}
      <View style={styles.filters}>
        <Text style={styles.label}>Spiciness Level (1–5):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="e.g. 3"
          value={spicinessLevel}
          onChangeText={setSpicinessLevel}
          maxLength={1}
        />

        <Text style={styles.label}>Origin Country:</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.countryButton,
              originCountry === "" && styles.countryButtonSelected,
            ]}
            onPress={() => setOriginCountry("")}
          >
            <Text
              style={[
                styles.countryText,
                originCountry === "" && styles.selectedText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {ORIGIN_COUNTRIES.map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.countryButton,
                originCountry === value && styles.countryButtonSelected,
              ]}
              onPress={() => setOriginCountry(value)}
            >
              <Text
                style={[
                  styles.countryText,
                  originCountry === value && styles.selectedText,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => {
            setSpicinessLevel("");
            setOriginCountry("");
          }}
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>Clear Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Noodle List */}
      <FlatList
        data={data?.instantNoodles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoodleItem {...item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", padding: 16 },

  filters: {
    marginBottom: 16,
  },

  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },

  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },

  countryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  countryButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },

  countryText: {
    color: "#000",
  },

  selectedText: {
    color: "#fff",
    fontWeight: "600",
  },

  clearButton: {
    marginTop: 8,
    alignSelf: "flex-start",
  },

  clearText: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
