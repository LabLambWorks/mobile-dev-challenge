import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FilterState } from "../index";

type Props = {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCountries: string[];
};

export function FilterControls({ filters, onFiltersChange, availableCountries }: Props) {
  const updateFilter = (field: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value === "" ? null : value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filters</Text>
      
      <View style={styles.filterRow}>
        <View style={styles.filterItem}>
          <Text style={styles.label}>Spiciness Level</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filters.spicinessLevel?.toString() || ""}
              onValueChange={(value) => updateFilter("spicinessLevel", value ? parseInt(value) : null)}
              style={styles.picker}
            >
              <Picker.Item label="All Levels" value="" />
              <Picker.Item label="🔥 (1)" value="1" />
              <Picker.Item label="🔥🔥 (2)" value="2" />
              <Picker.Item label="🔥🔥🔥 (3)" value="3" />
              <Picker.Item label="🔥🔥🔥🔥 (4)" value="4" />
              <Picker.Item label="🔥🔥🔥🔥🔥 (5)" value="5" />
            </Picker>
          </View>
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.label}>Origin Country</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filters.originCountry || ""}
              onValueChange={(value) => updateFilter("originCountry", value)}
              style={styles.picker}
            >
              <Picker.Item label="All Countries" value="" />
              {availableCountries.map((country) => (
                <Picker.Item key={country} label={country} value={country} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  filterItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  picker: {
    height: 50,
  },
});