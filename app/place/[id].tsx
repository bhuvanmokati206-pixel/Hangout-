import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
  Share,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/lib/useTheme";
import { PLACES, getPriceLabel } from "@/constants/places";
import { toggleFavorite, isFavorite } from "@/lib/favorites";

const { width } = Dimensions.get("window");

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [isFav, setIsFav] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const place = PLACES.find((p) => p.id === id);

  useEffect(() => {
    if (place) {
      isFavorite(place.id).then(setIsFav);
    }
  }, [place?.id]);

  const handleToggleFavorite = useCallback(async () => {
    if (!place) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await toggleFavorite(place.id);
    setIsFav(result);
  }, [place?.id]);

  const handleShare = useCallback(async () => {
    if (!place) return;
    try {
      await Share.share({
        message: `Check out ${place.name} - ${place.description}`,
      });
    } catch {}
  }, [place]);

  if (!place) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Place not found
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={[styles.retryBtn, { backgroundColor: colors.tint }]}
          >
            <Text style={styles.retryBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageSection}>
          <FlatList
            data={place.photos}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.heroImage}
                contentFit="cover"
                transition={200}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActivePhotoIndex(index);
            }}
            scrollEnabled={place.photos.length > 1}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.6)"]}
            style={styles.imageGradient}
          />

          <View
            style={[
              styles.imageNav,
              { top: (Platform.OS !== "web" ? insets.top : webTopInset) + 8 },
            ]}
          >
            <Pressable
              onPress={() => router.back()}
              style={styles.navBtn}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </Pressable>
            <View style={styles.navRight}>
              <Pressable onPress={handleToggleFavorite} style={styles.navBtn}>
                <Ionicons
                  name={isFav ? "heart" : "heart-outline"}
                  size={22}
                  color={isFav ? "#FF6B6B" : "#fff"}
                />
              </Pressable>
              <Pressable onPress={handleShare} style={styles.navBtn}>
                <Ionicons name="share-outline" size={22} color="#fff" />
              </Pressable>
            </View>
          </View>

          {place.photos.length > 1 && (
            <View style={styles.photoIndicators}>
              {place.photos.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor:
                        i === activePhotoIndex ? "#fff" : "rgba(255,255,255,0.4)",
                      width: i === activePhotoIndex ? 20 : 6,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={[styles.contentSection, { backgroundColor: colors.background }]}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.placeName, { color: colors.text }]}>
                {place.name}
              </Text>
              {place.cuisine && (
                <Text style={[styles.cuisine, { color: colors.textSecondary }]}>
                  {place.cuisine} {place.type.charAt(0).toUpperCase() + place.type.slice(1)}
                </Text>
              )}
            </View>
            <View style={[styles.priceTag, { backgroundColor: colors.tagBg }]}>
              <Text style={[styles.priceTagText, { color: colors.tagText }]}>
                {getPriceLabel(place.priceLevel)}
              </Text>
            </View>
          </View>

          <View style={styles.metaCards}>
            <View style={[styles.metaCard, { backgroundColor: colors.card }]}>
              <Ionicons name="star" size={18} color={colors.gold} />
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {place.rating}
              </Text>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                ({place.reviewCount})
              </Text>
            </View>
            <View style={[styles.metaCard, { backgroundColor: colors.card }]}>
              <Ionicons name="location" size={18} color={colors.tint} />
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {place.distance} km
              </Text>
            </View>
            <View style={[styles.metaCard, { backgroundColor: colors.card }]}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: place.isOpen ? "#34D399" : "#EF4444" },
                ]}
              />
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {place.isOpen ? "Open" : "Closed"}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={colors.tint} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                {place.address}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color={colors.tint} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Best time: {place.bestTimeToVisit}
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {place.description}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recommended For
          </Text>
          <View style={styles.tagsRow}>
            {place.recommendedFor.map((tag) => (
              <View
                key={tag}
                style={[styles.tag, { backgroundColor: colors.tagBg }]}
              >
                <Text style={[styles.tagText, { color: colors.tagText }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
          <View style={styles.tagsRow}>
            {place.tags.map((tag) => (
              <View
                key={tag}
                style={[styles.tag, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.tagText, { color: colors.text }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Reviews
          </Text>
          {place.reviews.map((review) => (
            <View
              key={review.id}
              style={[styles.reviewCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.reviewHeader}>
                <View style={styles.reviewUser}>
                  <View
                    style={[
                      styles.reviewAvatar,
                      { backgroundColor: colors.tint },
                    ]}
                  >
                    <Text style={styles.reviewAvatarText}>
                      {review.user.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.reviewName, { color: colors.text }]}>
                      {review.user}
                    </Text>
                    <Text
                      style={[
                        styles.reviewDate,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {review.date}
                    </Text>
                  </View>
                </View>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Ionicons
                      key={s}
                      name={s <= review.rating ? "star" : "star-outline"}
                      size={14}
                      color={colors.gold}
                    />
                  ))}
                </View>
              </View>
              <Text style={[styles.reviewText, { color: colors.textSecondary }]}>
                {review.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },
  imageSection: {
    position: "relative",
    height: 320,
  },
  heroImage: {
    width,
    height: 320,
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  imageNav: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  navRight: {
    flexDirection: "row",
    gap: 10,
  },
  photoIndicators: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  indicator: {
    height: 6,
    borderRadius: 3,
  },
  contentSection: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  placeName: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginBottom: 2,
  },
  cuisine: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  priceTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  priceTagText: {
    fontSize: 14,
    fontFamily: "Poppins_700Bold",
  },
  metaCards: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  metaCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  metaValue: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  metaLabel: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoCard: {
    marginTop: 16,
    borderRadius: 14,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    marginTop: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },
  reviewCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  reviewName: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    lineHeight: 20,
  },
});
