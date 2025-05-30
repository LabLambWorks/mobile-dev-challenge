import { Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useFavoritesStore } from "../store/favorites";
import { Ionicons } from "@expo/vector-icons";

const GET_NOODLE_DETAILS = gql`
  query GetNoodleDetails($id: ID!) {
    instantNoodle(where: { id: $id }) {
      id
      name
      brand
      spicinessLevel
      originCountry
      rating
      reviewsCount
      imageURL
      category {
        name
      }
    }
  }
`;

const UPDATE_REVIEW_COUNT = gql`
  mutation UpdateReviewCount($id: ID!, $reviewsCount: Int!) {
    updateInstantNoodle(
      where: { id: $id }
      data: { reviewsCount: $reviewsCount }
    ) {
      id
      reviewsCount
    }
  }
`;

export default function NoodlesDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { loading, error, data } = useQuery(GET_NOODLE_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const [updateReviewCount] = useMutation(UPDATE_REVIEW_COUNT, {
    update(cache, { data: mutationData }) {
      const existingNoodle = cache.readQuery({
        query: GET_NOODLE_DETAILS,
        variables: { id },
      });

      if (existingNoodle) {
        cache.writeQuery({
          query: GET_NOODLE_DETAILS,
          variables: { id },
          data: {
            instantNoodle: {
              ...existingNoodle.instantNoodle,
              reviewsCount: mutationData.updateInstantNoodle.reviewsCount,
            },
          },
        });
      }
    },
  });

  const handleLeaveReview = async () => {
    try {
      await updateReviewCount({
        variables: {
          id,
          reviewsCount: (data?.instantNoodle.reviewsCount || 0) + 1,
        },
      });
    } catch (err) {
      console.error("Failed to update review count:", err);
    }
  };

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
  const favorite = isFavorite(id);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen 
        options={{ 
          title: noodle.name,
          headerRight: () => (
            <Pressable 
              onPress={() => favorite ? removeFavorite(id) : addFavorite(id)}
              style={styles.favoriteButton}
            >
              <Ionicons 
                name={favorite ? "heart" : "heart-outline"} 
                size={24} 
                color={favorite ? "#FF4B3E" : "#000"} 
              />
            </Pressable>
          ),
        }} 
      />

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
        <Text style={styles.tag}>📝 {noodle.reviewsCount || 0} reviews</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.reviewButton} onPress={handleLeaveReview}>
          <Text style={styles.reviewButtonText}>Leave Review</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  reviewButton: {
    backgroundColor: "#FF4B3E",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reviewButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  buttonContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
});
