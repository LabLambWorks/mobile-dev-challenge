import { View, Text, StyleSheet, Pressable } from "react-native";
import { useFilterStore } from "../store/filters";
import { moderateScale, scale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";

const SPICINESS_LEVELS = [1, 2, 3, 4, 5];
const COUNTRIES = [
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

export function FilterControls() {
  const {
    spicinessLevel,
    originCountry,
    setSpicinessLevel,
    setOriginCountry,
    clearFilters,
  } = useFilterStore();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spiciness Level</Text>
        <View style={styles.spicyButtons}>
          {SPICINESS_LEVELS.map((level) => (
            <Pressable
              key={level}
              style={[
                styles.spicyButton,
                spicinessLevel === level && styles.selectedSpicy,
              ]}
              onPress={() =>
                setSpicinessLevel(spicinessLevel === level ? null : level)
              }
            >
              <Text
                style={[
                  styles.spicyText,
                  spicinessLevel === level && styles.selectedSpicyText,
                ]}
              >
                {level}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Origin Country</Text>
        <View style={styles.countryButtons}>
          {COUNTRIES.map(({ label, value }) => (
            <Pressable
              key={value}
              style={[
                styles.countryButton,
                originCountry === value && styles.selectedCountry,
              ]}
              onPress={() =>
                setOriginCountry(originCountry === value ? null : value)
              }
            >
              <Text
                style={[
                  styles.countryText,
                  originCountry === value && styles.selectedCountryText,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {(spicinessLevel || originCountry) && (
        <Pressable style={styles.clearButton} onPress={clearFilters}>
          <Ionicons name="close-circle" size={20} color="#666" />
          <Text style={styles.clearText}>Clear Filters</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: scale(16),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  section: {
    marginBottom: scale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    marginBottom: scale(8),
    color: "#333",
  },
  spicyButtons: {
    flexDirection: "row",
    gap: scale(8),
  },
  spicyButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSpicy: {
    backgroundColor: "#e74c3c",
    borderColor: "#e74c3c",
  },
  spicyText: {
    fontSize: moderateScale(16),
    color: "#666",
  },
  selectedSpicyText: {
    color: "#fff",
  },
  countryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  countryButton: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCountry: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  countryText: {
    fontSize: moderateScale(14),
    color: "#666",
  },
  selectedCountryText: {
    color: "#fff",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: scale(4),
    marginTop: scale(8),
  },
  clearText: {
    fontSize: moderateScale(14),
    color: "#666",
  },
});
