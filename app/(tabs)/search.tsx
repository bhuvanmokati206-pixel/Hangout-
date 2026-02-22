import React, { useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/useTheme";
import { PLACES, filterPlaces, Place } from "@/constants/places";
import PlaceCard from "@/components/PlaceCard";

const SUGGESTIONS = [
  "Biryani", "Cafe", "Adventure", "Rooftop", "Budget",
  "Gaming", "Trekking", "Chai", "Family", "Date Night",
  "Hyderabadi", "Barbecue", "Lake", "Cinema", "Escape Room",
];

export default function SearchScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return filterPlaces(PLACES, { search: query.trim() });
  }, [query]);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return SUGGESTIONS;
    return SUGGESTIONS.filter((s) =>
      s.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const renderItem = useCallback(
    ({ item }: { item: Place }) => (
      <View style={styles.cardContainer}>
        <PlaceCard place={item} horizontal />
      </View>
    ),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.searchHeader,
          {
            paddingTop: (Platform.OS !== "web" ? insets.top : webTopInset) + 12,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={[styles.searchBar, { backgroundColor: colors.inputBg }]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search restaurants, cuisines, places..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {query.trim().length === 0 ? (
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, { color: colors.textSecondary }]}>
            Popular Searches
          </Text>
          <View style={styles.suggestionsWrap}>
            {filteredSuggestions.map((suggestion) => (
              <Pressable
                key={suggestion}
                onPress={() => setQuery(suggestion)}
                style={({ pressed }) => [
                  styles.suggestionChip,
                  {
                    backgroundColor: colors.surface,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Ionicons name="trending-up" size={14} color={colors.tint} />
                <Text style={[styles.suggestionText, { color: colors.text }]}>
                  {suggestion}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No results found
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Try a different search term
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!results.length}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
  },
  suggestionsContainer: {
    padding: 20,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 12,
  },
  suggestionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },
  resultsList: {
    padding: 20,
    paddingBottom: Platform.OS === "web" ? 84 : 100,
  },
  cardContainer: {
    marginBottom: 0,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
});
