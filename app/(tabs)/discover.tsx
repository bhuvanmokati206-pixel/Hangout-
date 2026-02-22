import React, { useState, useMemo, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
  FlatList,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  SlideInRight,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/lib/useTheme";
import {
  PLACES,
  COMPANIONS,
  MOODS,
  PLACE_TYPES,
  filterPlaces,
  Place,
} from "@/constants/places";
import PlaceCard from "@/components/PlaceCard";

const { width } = Dimensions.get("window");

type Step = "companion" | "mood" | "type" | "results";

const BUDGETS = [
  { id: 1, label: "Low", icon: "wallet-outline" as const },
  { id: 2, label: "Medium", icon: "wallet" as const },
  { id: 3, label: "High", icon: "diamond" as const },
];

const DISTANCES = [
  { id: 1, label: "1 km", value: 1 },
  { id: 5, label: "5 km", value: 5 },
  { id: 10, label: "10 km", value: 10 },
  { id: 50, label: "Any", value: 50 },
];

export default function DiscoverScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const [step, setStep] = useState<Step>("companion");
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [budgetFilter, setBudgetFilter] = useState<number | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<number>(50);
  const [ratingFilter, setRatingFilter] = useState<number>(0);

  const results = useMemo(() => {
    return filterPlaces(PLACES, {
      companion: selectedCompanion || undefined,
      mood: selectedMood || undefined,
      type: selectedType || undefined,
      priceLevel: budgetFilter || undefined,
      maxDistance: distanceFilter,
      minRating: ratingFilter || undefined,
    });
  }, [selectedCompanion, selectedMood, selectedType, budgetFilter, distanceFilter, ratingFilter]);

  const stepNumber = step === "companion" ? 1 : step === "mood" ? 2 : step === "type" ? 3 : 4;
  const totalSteps = 3;

  const handleCompanionSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCompanion(id);
    setStep("mood");
  };

  const handleMoodSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMood(id);
    setStep("type");
  };

  const handleTypeSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedType(id);
    setStep("results");
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep("companion");
    setSelectedCompanion(null);
    setSelectedMood(null);
    setSelectedType(null);
    setBudgetFilter(null);
    setDistanceFilter(50);
    setRatingFilter(0);
  };

  const handleBack = () => {
    if (step === "mood") {
      setStep("companion");
      setSelectedMood(null);
    } else if (step === "type") {
      setStep("mood");
      setSelectedType(null);
    } else if (step === "results") {
      setStep("type");
    }
  };

  const renderStepContent = () => {
    if (step === "companion") {
      return (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
          <Text style={[styles.stepTitle, { color: colors.text }]}>
            Who are you with?
          </Text>
          <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
            Pick your crew for today
          </Text>
          <View style={styles.optionsGrid}>
            {COMPANIONS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleCompanionSelect(item.id)}
                style={({ pressed }) => [
                  styles.optionCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: selectedCompanion === item.id ? colors.tint : colors.border,
                    borderWidth: selectedCompanion === item.id ? 2 : 1,
                    opacity: pressed ? 0.85 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color={colors.tint}
                />
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      );
    }

    if (step === "mood") {
      return (
        <Animated.View entering={Platform.OS !== "web" ? SlideInRight.duration(300) : undefined} style={styles.stepContent}>
          <Text style={[styles.stepTitle, { color: colors.text }]}>
            What is your vibe?
          </Text>
          <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
            Pick your mood for today
          </Text>
          <View style={styles.optionsGrid}>
            {MOODS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleMoodSelect(item.id)}
                style={({ pressed }) => [
                  styles.optionCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: selectedMood === item.id ? item.color : colors.border,
                    borderWidth: selectedMood === item.id ? 2 : 1,
                    opacity: pressed ? 0.85 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color={item.color}
                />
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      );
    }

    if (step === "type") {
      return (
        <Animated.View entering={Platform.OS !== "web" ? SlideInRight.duration(300) : undefined} style={styles.stepContent}>
          <Text style={[styles.stepTitle, { color: colors.text }]}>
            What type of place?
          </Text>
          <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
            Choose your destination type
          </Text>
          <View style={styles.typeGrid}>
            {PLACE_TYPES.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleTypeSelect(item.id)}
                style={({ pressed }) => [
                  styles.typeCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: selectedType === item.id ? colors.tint : colors.border,
                    borderWidth: selectedType === item.id ? 2 : 1,
                    opacity: pressed ? 0.85 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={32}
                  color={colors.tint}
                />
                <Text style={[styles.typeLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View entering={FadeIn.duration(300)} style={styles.resultsContent}>
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsTitle, { color: colors.text }]}>
            {results.length} place{results.length !== 1 ? "s" : ""} found
          </Text>
          <Pressable
            onPress={() => setShowFilters(true)}
            style={({ pressed }) => [
              styles.filterBtn,
              {
                backgroundColor: colors.surface,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="options" size={18} color={colors.tint} />
            <Text style={[styles.filterBtnText, { color: colors.tint }]}>
              Filters
            </Text>
          </Pressable>
        </View>

        {results.length === 0 ? (
          <View style={styles.emptyResults}>
            <Ionicons name="sad-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No matches found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Try adjusting your filters or preferences
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={({ item }) => <PlaceCard place={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 84 : 100 }}
            scrollEnabled={!!results.length}
          />
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: (Platform.OS !== "web" ? insets.top : webTopInset) + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.topBarRow}>
          {step !== "companion" && (
            <Pressable onPress={handleBack} hitSlop={8}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
          )}
          <Text style={[styles.topBarTitle, { color: colors.text }]}>
            Find Places
          </Text>
          {step !== "companion" && (
            <Pressable onPress={handleReset} hitSlop={8}>
              <Ionicons name="refresh" size={22} color={colors.tint} />
            </Pressable>
          )}
        </View>

        {step !== "results" && (
          <View style={styles.progressBar}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[
                  styles.progressSegment,
                  {
                    backgroundColor: s <= stepNumber ? colors.tint : colors.border,
                    flex: 1,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {renderStepContent()}

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View
            style={[
              styles.filterModal,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.filterModalHeader}>
              <Text style={[styles.filterModalTitle, { color: colors.text }]}>
                Refine Results
              </Text>
              <Pressable onPress={() => setShowFilters(false)} hitSlop={8}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.filterModalContent}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>
                Budget
              </Text>
              <View style={styles.filterRow}>
                {BUDGETS.map((b) => (
                  <Pressable
                    key={b.id}
                    onPress={() => setBudgetFilter(budgetFilter === b.id ? null : b.id)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor:
                          budgetFilter === b.id ? colors.tint : colors.surface,
                      },
                    ]}
                  >
                    <Ionicons
                      name={b.icon as any}
                      size={16}
                      color={budgetFilter === b.id ? "#fff" : colors.text}
                    />
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: budgetFilter === b.id ? "#fff" : colors.text },
                      ]}
                    >
                      {b.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.filterLabel, { color: colors.text }]}>
                Distance
              </Text>
              <View style={styles.filterRow}>
                {DISTANCES.map((d) => (
                  <Pressable
                    key={d.id}
                    onPress={() => setDistanceFilter(d.value)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor:
                          distanceFilter === d.value ? colors.tint : colors.surface,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color:
                            distanceFilter === d.value ? "#fff" : colors.text,
                        },
                      ]}
                    >
                      {d.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.filterLabel, { color: colors.text }]}>
                Minimum Rating
              </Text>
              <View style={styles.filterRow}>
                {[0, 3, 4, 4.5].map((r) => (
                  <Pressable
                    key={r}
                    onPress={() => setRatingFilter(r)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor:
                          ratingFilter === r ? colors.tint : colors.surface,
                      },
                    ]}
                  >
                    {r > 0 && (
                      <Ionicons
                        name="star"
                        size={14}
                        color={ratingFilter === r ? "#fff" : colors.gold}
                      />
                    )}
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: ratingFilter === r ? "#fff" : colors.text },
                      ]}
                    >
                      {r === 0 ? "Any" : `${r}+`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <Pressable
              onPress={() => setShowFilters(false)}
              style={[styles.applyBtn, { backgroundColor: colors.tint }]}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  topBarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  topBarTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    flex: 1,
    textAlign: "center",
  },
  progressBar: {
    flexDirection: "row",
    gap: 6,
    marginTop: 12,
  },
  progressSegment: {
    height: 3,
    borderRadius: 2,
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginBottom: 24,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  optionCard: {
    width: (width - 52) / 2,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 10,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typeCard: {
    width: (width - 52) / 2,
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  typeLabel: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },
  resultsContent: {
    flex: 1,
    padding: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterBtnText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },
  emptyResults: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },
  filterModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  filterModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
  },
  filterModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 12,
  },
  filterModalTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  filterModalContent: {
    paddingHorizontal: 20,
  },
  filterLabel: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 10,
    marginTop: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },
  applyBtn: {
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  applyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});
