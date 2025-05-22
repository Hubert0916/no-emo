import AsyncStorage from "@react-native-async-storage/async-storage";

export async function cacheMoodLocally(entry) {
  try {
    const raw = await AsyncStorage.getItem("pendingMoods");
    const list = raw ? JSON.parse(raw) : [];
    list.push(entry);
    await AsyncStorage.setItem("pendingMoods", JSON.stringify(list));
  } catch (e) {
    console.error("Failed to cache mood locally:", e);
  }
}