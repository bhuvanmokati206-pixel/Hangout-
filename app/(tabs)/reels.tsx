import React, { useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  Platform,
  FlatList,
  ViewToken,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/lib/useTheme";
import { REELS, Reel, PLACES } from "@/constants/places";

const { width, height } = Dimensions.get("window");

function ReelItem({ item, isActive }: { item: Reel; isActive: boolean }) {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLiked(!liked);
  };

  const handleViewPlace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/place/[id]", params: { id: item.placeId } });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  return (
    <View style={styles.reelContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.reelImage}
        contentFit="cover"
        transition={300}
      />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={styles.reelGradient}
      />

      <View
        style={[
          styles.reelHeader,
          { top: (Platform.OS !== "web" ? insets.top : webTopInset) + 12 },
        ]}
      >
        <Text style={styles.reelHeaderTitle}>Reels</Text>
      </View>

      <View style={styles.reelActions}>
        <Pressable onPress={handleLike} style={styles.reelAction}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={28}
            color={liked ? "#FF6B6B" : "#fff"}
          />
          <Text style={styles.reelActionText}>
            {formatNumber(item.likes + (liked ? 1 : 0))}
          </Text>
        </Pressable>
        <Pressable style={styles.reelAction}>
          <Ionicons name="eye-outline" size={28} color="#fff" />
          <Text style={styles.reelActionText}>{formatNumber(item.views)}</Text>
        </Pressable>
        <Pressable onPress={handleViewPlace} style={styles.reelAction}>
          <Ionicons name="location" size={28} color="#fff" />
          <Text style={styles.reelActionText}>Visit</Text>
        </Pressable>
        <Pressable style={styles.reelAction}>
          <Ionicons name="share-social-outline" size={28} color="#fff" />
          <Text style={styles.reelActionText}>Share</Text>
        </Pressable>
      </View>

      <View style={[styles.reelInfo, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 80 }]}>
        <Pressable onPress={handleViewPlace}>
          <Text style={styles.reelPlaceName}>{item.placeName}</Text>
        </Pressable>
        <Text style={styles.reelCaption}>{item.caption}</Text>
        <View style={styles.reelCreator}>
          <View style={styles.creatorAvatar}>
            <Ionicons name="person" size={14} color="#fff" />
          </View>
          <Text style={styles.creatorName}>{item.creator}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ReelsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={REELS}
        renderItem={({ item, index }) => (
          <ReelItem item={item} isActive={index === activeIndex} />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEnabled={!!REELS.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  reelContainer: {
    width,
    height: height,
    position: "relative",
  },
  reelImage: {
    width: "100%",
    height: "100%",
  },
  reelGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  reelHeader: {
    position: "absolute",
    left: 20,
    right: 20,
  },
  reelHeaderTitle: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
  },
  reelActions: {
    position: "absolute",
    right: 16,
    bottom: "25%",
    gap: 20,
    alignItems: "center",
  },
  reelAction: {
    alignItems: "center",
    gap: 4,
  },
  reelActionText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Poppins_500Medium",
  },
  reelInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 70,
    paddingHorizontal: 20,
  },
  reelPlaceName: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
    marginBottom: 4,
  },
  reelCaption: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 10,
  },
  reelCreator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  creatorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  creatorName: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },
});
