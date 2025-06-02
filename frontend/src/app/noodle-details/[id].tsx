import { Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_NOODLE_DETAILS = gql`
  query GetNoodleDetails($id: ID!) {
    instantNoodle(where: { id: $id }) {
      id
      name
      brand
      spicinessLevel
      originCountry
      rating
      imageURL
      category {
        name
        __typename
      }
      reviewsCount
      __typename
    }
  }
`;

const INCREMENT_REVIEW = gql`
  mutation IncrementReview($id: ID!) {
    incrementNoodleReview(id: $id)
  }
`;

export default function NoodlesDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { loading, error, data } = useQuery(GET_NOODLE_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const [incrementReview, { loading: mutationLoading }] = useMutation(INCREMENT_REVIEW, {
    update(cache, { data: mutationData }) {
      if (!mutationData) return;
      const newCount = mutationData.incrementNoodleReview;
      try {
        const existingData: any = cache.readQuery({
          query: GET_NOODLE_DETAILS,
          variables: { id },
        });
        if (!existingData) return;

        cache.writeQuery({
          query: GET_NOODLE_DETAILS,
          variables: { id },
          data: {
            instantNoodle: {
              ...existingData.instantNoodle,
              reviewsCount: newCount,
            },
          },
        });
      } catch (error) {
        console.error("Cache update error:", error);
      }
    },
    optimisticResponse: {
      incrementNoodleReview: (data?.instantNoodle.reviewsCount ?? 0) + 1,
    },
    onError(error) {
      console.error("Mutation error:", error);
    },
    onCompleted(data) {
      console.log("Mutation completed:", data);
    },
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !data?.instantNoodle) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load noodle details.</Text>
      </View>
    );
  }

  const noodle = data.instantNoodle;

  console.log("Current reviewsCount:", noodle.reviewsCount);
  console.log("Noodle ID:", id);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: noodle.name }} />

      {noodle.imageURL && (
        <Image
          source={{ uri: noodle.imageURL }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Text style={styles.title}>{noodle.name}</Text>
      <Text style={styles.subtitle}>Brand: {noodle.brand}</Text>

      <View style={styles.tags}>
        <Text style={styles.tag}>🌍 {noodle.originCountry}</Text>
        <Text style={styles.tag}>🔥{"🔥".repeat(noodle.spicinessLevel)}</Text>
        <Text style={styles.tag}>⭐ {noodle.rating}/10</Text>
        <Text style={styles.tag}>📦 {noodle.category?.name}</Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>
          Reviews Count: {noodle.reviewsCount}
        </Text>
        <Button
          title={mutationLoading ? "Submitting..." : "Leave Review"}
          onPress={() => {
            console.log("Leave Review clicked for id:", id);
            if (id) incrementReview({ variables: { id } });
          }}
          disabled={mutationLoading || !id}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red" },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 16, marginBottom: 12 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
});
