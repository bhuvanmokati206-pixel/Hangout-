import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "vibe_finder_favorites";

export async function getFavorites(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function toggleFavorite(placeId: string): Promise<boolean> {
  const favorites = await getFavorites();
  const index = favorites.indexOf(placeId);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(placeId);
  }
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return index < 0;
}

export async function isFavorite(placeId: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(placeId);
}
