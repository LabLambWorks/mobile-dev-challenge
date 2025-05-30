import React, { useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { useMemo } from "react";

type FilterProps = {
  spicinessLevel: number | null;
  originCountry: string | null;
  onSpicinessChange: (value: number | null) => void;
  onCountryChange: (value: string | null) => void;
  isVisible: boolean;
  onClose: () => void;
};

const countries = [
  { label: "All Countries", value: null },
  { label: "South Korea", value: "south_korea" },
  { label: "Indonesia", value: "indonesia" },
  { label: "Malaysia", value: "malaysia" },
  { label: "Thailand", value: "thailand" },
  { label: "Japan", value: "japan" },
  { label: "Singapore", value: "singapore" },
  { label: "Vietnam", value: "vietnam" },
  { label: "China", value: "china" },
  { label: "Taiwan", value: "taiwan" },
  { label: "Philippines", value: "philippines" },
];

const spicinessLevels = [
  { label: "All Levels", value: null },
  { label: "1 (Mild)", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5 (Hot)", value: 5 },
];

export function NoodleFilters({
  spicinessLevel,
  originCountry,
  onSpicinessChange,
  onCountryChange,
  isVisible,
  onClose,
}: FilterProps) {
  const renderSpicinessButtons = useCallback(
    () => (
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Spiciness Level</Text>
        <View style={styles.buttonGrid}>
          {spicinessLevels.map((level) => (
            <Pressable
              key={level.value?.toString() || "all"}
              style={[
                styles.filterButton,
                spicinessLevel === level.value && styles.filterButtonActive,
              ]}
              onPress={() => onSpicinessChange(level.value)}
            >
              <Text
                style={[
                  styles.buttonText,
                  spicinessLevel === level.value && styles.buttonTextActive,
                ]}
              >
                {level.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    ),
    [spicinessLevel, onSpicinessChange]
  );

  const renderCountryButtons = useCallback(
    () => (
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Country of Origin</Text>
        <View style={styles.buttonGrid}>
          {countries.map((country) => (
            <Pressable
              key={country.value || "all"}
              style={[
                styles.filterButton,
                originCountry === country.value && styles.filterButtonActive,
              ]}
              onPress={() => onCountryChange(country.value)}
            >
              <Text
                style={[
                  styles.buttonText,
                  originCountry === country.value && styles.buttonTextActive,
                ]}
              >
                {country.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    ),
    [originCountry, onCountryChange]
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.handle} />
          <Text style={styles.title}>Filter Noodles</Text>
          {renderSpicinessButtons()}
          {renderCountryButtons()}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "50%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDDDDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  buttonText: {
    color: "#333",
    fontSize: 14,
  },
  buttonTextActive: {
    color: "white",
  },
});
