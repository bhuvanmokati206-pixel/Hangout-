import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  Platform,
  Dimensions,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/lib/useTheme";
import { PLACES } from "@/constants/places";
import PlaceCard from "@/components/PlaceCard";
import SectionHeader from "@/components/SectionHeader";
import QuickAction from "@/components/QuickAction";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const trendingPlaces = PLACES.filter((p) => p.trending);
  const nearbyPlaces = PLACES.filter((p) => p.distance <= 3);
  const sponsoredPlaces = PLACES.filter((p) => p.sponsored);

  const renderTrendingItem = useCallback(
    ({ item }: { item: (typeof PLACES)[0] }) => (
      <View style={{ marginLeft: 20, marginRight: 4 }}>
        <PlaceCard place={item} compact />
      </View>
    ),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 84 : 100,
        }}
      >
        <LinearGradient
          colors={
            isDark
              ? ["#0F3460", "#1A1A2E"]
              : ["#2EC4B6", "#1A8A7E"]
          }
          style={[
            styles.header,
            { paddingTop: (Platform.OS !== "web" ? insets.top : webTopInset) + 16 },
          ]}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Discover</Text>
              <Text style={styles.subGreeting}>
                Find your perfect spot in Hyderabad
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/search")}
              style={({ pressed }) => [
                styles.headerSearchBtn,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons name="search" size={20} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.quickActions}>
            <QuickAction
              icon="search"
              label="Search"
              color="#FFD93D"
              onPress={() => router.push("/(tabs)/search")}
            />
            <QuickAction
              icon="compass"
              label="Find Places"
              color="#FF6B6B"
              onPress={() => router.push("/(tabs)/discover")}
            />
            <QuickAction
              icon="videocam"
              label="Reels"
              color="#A78BFA"
              onPress={() => router.push("/(tabs)/reels")}
            />
            <QuickAction
              icon="heart"
              label="Favorites"
              color="#F472B6"
              onPress={() => router.push("/favorites")}
            />
          </View>
        </LinearGradient>

        {sponsoredPlaces.length > 0 && (
          <>
            <SectionHeader title="Featured" />
            <FlatList
              data={sponsoredPlaces}
              renderItem={renderTrendingItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={!!sponsoredPlaces.length}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </>
        )}

        <SectionHeader title="Trending Near You" />
        <FlatList
          data={trendingPlaces}
          renderItem={renderTrendingItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={!!trendingPlaces.length}
          contentContainerStyle={{ paddingRight: 20 }}
        />

        <SectionHeader title="Nearby Places" />
        <View style={styles.nearbyList}>
          {nearbyPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} horizontal />
          ))}
        </View>

        <SectionHeader title="All Places" />
        <View style={styles.nearbyList}>
          {PLACES.map((place) => (
            <PlaceCard key={place.id} place={place} />
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
  header: {
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
  },
  subGreeting: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  headerSearchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  nearbyList: {
    paddingHorizontal: 20,
  },
});
