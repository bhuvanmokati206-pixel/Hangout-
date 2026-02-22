import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "@/lib/useTheme";
import { PLACES, Place } from "@/constants/places";
import { getFavorites } from "@/lib/favorites";
import PlaceCard from "@/components/PlaceCard";

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [favorites, setFavorites] = useState<Place[]>([]);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then((ids) => {
        const favPlaces = PLACES.filter((p) => ids.includes(p.id));
        setFavorites(favPlaces);
      });
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: (Platform.OS !== "web" ? insets.top : webTopInset) + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Favorites
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={56} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Save places you love to find them easily later
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => <PlaceCard place={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!favorites.length}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
