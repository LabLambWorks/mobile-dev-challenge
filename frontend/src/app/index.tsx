import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Pressable } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_NOODLES } from './queries';
import { NoodleItem } from './components/NoodleItem';
import { Stack, useRouter } from 'expo-router';
// import { useFilter } from '@/contexts/FilterContext'; // Assume you already have filter context for syncing filters

export default function NoodleListScreen() {
  const { loading, error, data } = useQuery(GET_NOODLES);
  const router:any = useRouter();

  // console.log("data",data.instantNoodles)

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Noodles',
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/favourites')}
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }, styles.headerButton]}
            >
              <Text style={styles.headerButtonText}>Favourites</Text>
            </Pressable>
          ),
        }}
      />
      {loading && <ActivityIndicator style={styles.loader} size="large" />}
      {error && <Text style={styles.error}>Error: {error.message}</Text>}
      {data && (
        <FlatList
          data={data.instantNoodles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoodleItem {...item} />}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', padding: 16 },
  headerButton: { marginRight: 16 },
  headerButtonText: { color: '#007AFF', fontWeight: '600' },
});
