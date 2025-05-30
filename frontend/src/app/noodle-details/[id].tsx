import { Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";
import { LEAVE_REVIEW } from "../queries";
import { useFavourites } from "../contexts/FavouritesContext";

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
      reviewsCount
      category {
        name
      }
    }
  }
`;

export default function NoodlesDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addFavourite, removeFavourite, isFavourite } = useFavourites();
  
  const { loading, error, data } = useQuery(GET_NOODLE_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const [leaveReview, { loading: reviewLoading }] = useMutation(LEAVE_REVIEW, {
    variables: { id },
    update: (cache, { data }) => {
      if (data?.leaveReview) {
        cache.modify({
          id: cache.identify({ __typename: "InstantNoodle", id }),
          fields: {
            reviewsCount: () => data.leaveReview.reviewsCount,
          },
        });
      }
    },
    onCompleted: () => {
      Alert.alert("Success", "Thank you for your review!");
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to submit review. Please try again.");
      console.error("Review error:", error);
    },
  });

  const handleLeaveReview = () => {
    Alert.alert(
      "Leave Review",
      "Are you sure you want to leave a review for this noodle?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes", 
          onPress: () => leaveReview(),
        },
      ]
    );
  };

  const handleToggleFavourite = async () => {
    if (!id) return;
    
    try {
      if (isFavourite(id)) {
        await removeFavourite(id);
        Alert.alert("Removed", "Removed from favourites");
      } else {
        await addFavourite(id);
        Alert.alert("Added", "Added to favourites!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update favourites");
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
  const isNoodleFavourite = id ? isFavourite(id) : false;

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
        <Text style={styles.tag}>
          📝 Reviews: {noodle.reviewsCount || 0}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.reviewButton, reviewLoading && styles.reviewButtonDisabled]}
          onPress={handleLeaveReview}
          disabled={reviewLoading}
        >
          {reviewLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.reviewButtonText}>Leave Review</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.favouriteButton, isNoodleFavourite && styles.favouriteButtonActive]}
          onPress={handleToggleFavourite}
        >
          <Text style={[styles.favouriteButtonText, isNoodleFavourite && styles.favouriteButtonTextActive]}>
            {isNoodleFavourite ? "♥ Remove from Favourites" : "♡ Add to Favourites"}
          </Text>
        </TouchableOpacity>
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
    marginBottom: 24,
  },
  tag: {
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
  },
  reviewButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  reviewButtonDisabled: {
    opacity: 0.6,
  },
  reviewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  favouriteButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ff4444",
  },
  favouriteButtonActive: {
    backgroundColor: "#ff4444",
  },
  favouriteButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
  favouriteButtonTextActive: {
    color: "white",
  },
});