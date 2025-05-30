import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";
import client from "@/api/client";
import { FavouritesProvider } from "./contexts/FavouritesContext";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <FavouritesProvider>
        <Stack />
      </FavouritesProvider>
    </ApolloProvider>
  );
}