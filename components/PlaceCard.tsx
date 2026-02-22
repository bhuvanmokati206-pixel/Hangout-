import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/lib/useTheme";
import { Place, getPriceLabel } from "@/constants/places";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

interface PlaceCardProps {
  place: Place;
  compact?: boolean;
  horizontal?: boolean;
}

export default function PlaceCard({ place, compact, horizontal }: PlaceCardProps) {
  const { colors, isDark } = useTheme();

  const handlePress = useCallback(() => {
    router.push({ pathname: "/place/[id]", params: { id: place.id } });
  }, [place.id]);

  if (horizontal) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.horizontalCard,
          {
            backgroundColor: colors.card,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <Image
          source={{ uri: place.image }}
          style={styles.horizontalImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.horizontalContent}>
          <Text style={[styles.horizontalName, { color: colors.text }]} numberOfLines={1}>
            {place.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={colors.gold} />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {place.rating}
            </Text>
            <Text style={[styles.dot, { color: colors.textSecondary }]}>
              {" "}
            </Text>
            <Text style={[styles.distanceText, { color: colors.textSecondary }]}>
              {place.distance} km
            </Text>
          </View>
          <Text style={[styles.priceText, { color: colors.tint }]}>
            {getPriceLabel(place.priceLevel)}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          width: compact ? width * 0.7 : CARD_WIDTH,
          opacity: pressed ? 0.95 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: place.image }}
          style={[styles.image, compact && styles.compactImage]}
          contentFit="cover"
          transition={200}
        />
        {place.sponsored && (
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText}>Sponsored</Text>
          </View>
        )}
        {place.trending && (
          <View style={[styles.trendingBadge, { backgroundColor: colors.accent }]}>
            <Ionicons name="trending-up" size={12} color="#fff" />
            <Text style={styles.trendingText}>Trending</Text>
          </View>
        )}
        {place.isOpen && (
          <View style={styles.openBadge}>
            <View style={styles.openDot} />
            <Text style={styles.openText}>Open</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            style={[styles.name, { color: colors.text }]}
            numberOfLines={1}
          >
            {place.name}
          </Text>
          <View style={[styles.priceTag, { backgroundColor: colors.tagBg }]}>
            <Text style={[styles.priceTagText, { color: colors.tagText }]}>
              {getPriceLabel(place.priceLevel)}
            </Text>
          </View>
        </View>
        {place.cuisine && (
          <Text style={[styles.cuisine, { color: colors.textSecondary }]}>
            {place.cuisine}
          </Text>
        )}
        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.gold} />
            <Text style={[styles.rating, { color: colors.text }]}>
              {place.rating}
            </Text>
            <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
              ({place.reviewCount})
            </Text>
          </View>
          <View style={styles.distanceRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.distance, { color: colors.textSecondary }]}>
              {place.distance} km
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
    }),
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 180,
  },
  compactImage: {
    height: 140,
  },
  sponsoredBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sponsoredText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Poppins_500Medium",
  },
  trendingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendingText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Poppins_600SemiBold",
  },
  openBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  openDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#34D399",
  },
  openText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Poppins_500Medium",
  },
  content: {
    padding: 14,
    gap: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    flex: 1,
    marginRight: 8,
  },
  priceTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceTagText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
  },
  cuisine: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  distance: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  horizontalCard: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
    }),
  },
  horizontalImage: {
    width: 90,
    height: 90,
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    gap: 2,
  },
  horizontalName: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  ratingText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  dot: {
    fontSize: 12,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  priceText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
  },
});
