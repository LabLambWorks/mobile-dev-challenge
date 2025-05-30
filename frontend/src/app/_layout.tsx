import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";
import client from "@/api/client";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView>
        <Stack />
      </GestureHandlerRootView>
    </ApolloProvider>
  );
}
