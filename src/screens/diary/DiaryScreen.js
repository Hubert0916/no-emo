import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { getCalendarMatrix } from "@/lib/util/getCalendarMatrix";
import CalendarGrid from "@/components/diary/CalendarGrid";
import MoodModal from "@/components/diary/MoodModal";
import { useAuth } from "@/contexts/AuthContext";
import Theme from "@/lib/theme";
import { cacheMoodLocally } from "@/lib/util/cacheMoodLocally";
import {
  uploadDiaryToServer,
  fetchDiaryFromServer,
} from "@/lib/api/diaryRequest";

// Mood options constants
const MOOD_OPTIONS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😰", label: "Anxious" },
];

const { width } = Dimensions.get("window");

export default function DiaryScreen() {
  // Get current date
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // State management
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState({});
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState(currentMonth);
  const [currentDisplayYear, setCurrentDisplayYear] = useState(currentYear);
  const [calendarMatrix, setCalendarMatrix] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' or 'history'
  const [tempInputText, setTempInputText] = useState(""); // Temporary input text for modal
  const [tempSelectedEmoji, setTempSelectedEmoji] = useState(""); // Temporary emoji for modal

  const swipeHandledRef = useRef(false);
  const { token } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fabPulseAnim = useRef(new Animated.Value(1)).current;

  // Initialize animations
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Title slide in animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // FAB pulse animation
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(fabPulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fabPulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulseAnimation());
    };
    pulseAnimation();
  }, []);

  // Swipe gesture handling
  const panGesture = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 20,
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      swipeHandledRef.current = false;
    },
    onPanResponderRelease: (_, g) => {
      if (!swipeHandledRef.current) {
        if (g.dx > 30 || g.vx > 0.5) prevMonth();
        else if (g.dx < -30 || g.vx < -0.5) nextMonth();
        swipeHandledRef.current = true;
      }
    },
  }).panHandlers;

  // Month navigation functions (with animation effects)
  const nextMonth = () => {
    // Add transition animation
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      if (currentDisplayMonth === 11) {
        setCurrentDisplayMonth(0);
        setCurrentDisplayYear(currentDisplayYear + 1);
      } else {
        setCurrentDisplayMonth(currentDisplayMonth + 1);
      }

      // Add transition animation
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const prevMonth = () => {
    // Add transition animation
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      if (currentDisplayMonth === 0) {
        setCurrentDisplayMonth(11);
        setCurrentDisplayYear(currentDisplayYear - 1);
      } else {
        setCurrentDisplayMonth(currentDisplayMonth - 1);
      }

      // Add transition animation
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  // Modal management
  const openModal = (date) => {
    setSelectedDate(date);
    setTempInputText(diaryEntries[date]?.text || ""); // Initialize with existing text
    setTempSelectedEmoji(diaryEntries[date]?.mood || ""); // Initialize with existing emoji
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDate(null);
    setTempInputText(""); // Clear temporary text
    setTempSelectedEmoji(""); // Clear temporary emoji
  };

  // Data loading functions
  const loadDiaryEntries = async () => {
    try {
      setIsLoading(true);

      // First load from local storage
      const storedEntries = await AsyncStorage.getItem("diaryEntries");
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries);
        setDiaryEntries(parsedEntries);
      }

      // Then fetch from server if authenticated
      if (token) {
        const serverData = await fetchDiaryFromServer();
        if (serverData && serverData.length > 0) {
          const serverEntries = {};
          serverData.forEach((entry) => {
            serverEntries[entry.date] = {
              id: entry.id || Date.now().toString(),
              date: entry.date,
              mood: entry.mood,
              moodLabel:
                MOOD_OPTIONS.find((option) => option.emoji === entry.mood)
                  ?.label || "Unknown",
              text: entry.diary || "",
              timestamp: entry.createdAt || new Date().toISOString(),
              synced: true,
            };
          });

          // Merge server data with local data
          setDiaryEntries((prev) => ({ ...prev, ...serverEntries }));

          // Update local storage with server data
          await AsyncStorage.setItem(
            "diaryEntries",
            JSON.stringify({
              ...JSON.parse(storedEntries || "{}"),
              ...serverEntries,
            })
          );
        }
      }

      // Load pending entries
      const pendingEntries = await AsyncStorage.getItem("pendingDiaryEntries");
      if (pendingEntries) {
        const parsedPending = JSON.parse(pendingEntries);
        setDiaryEntries((prev) => ({ ...prev, ...parsedPending }));
      }
    } catch (error) {
      console.error("Error loading diary entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync pending upload data
  const syncPendingEntries = async () => {
    if (!token) return;

    try {
      // Sync pending moods from cacheMoodLocally
      const pendingMoods = await AsyncStorage.getItem("pendingMoods");
      if (pendingMoods) {
        const pendingList = JSON.parse(pendingMoods);
        const successfulUploads = [];

        for (const entry of pendingList) {
          try {
            const response = await uploadDiaryToServer(
              entry.date,
              entry.text || "",
              entry.mood
            );
            if (response && response.ok) {
              successfulUploads.push(entry.date);

              // Update local entry to mark as synced
              const updatedEntries = { ...diaryEntries };
              if (updatedEntries[entry.date]) {
                updatedEntries[entry.date].synced = true;
              }
              setDiaryEntries(updatedEntries);
              await AsyncStorage.setItem(
                "diaryEntries",
                JSON.stringify(updatedEntries)
              );
            }
          } catch (uploadError) {
            console.error("Error uploading entry:", entry.date, uploadError);
          }
        }

        // Remove successfully uploaded entries from pending
        if (successfulUploads.length > 0) {
          const remainingPending = pendingList.filter(
            (entry) => !successfulUploads.includes(entry.date)
          );
          await AsyncStorage.setItem(
            "pendingMoods",
            JSON.stringify(remainingPending)
          );
        }
      }

      // Also sync legacy pending entries
      const pendingEntries = await AsyncStorage.getItem("pendingDiaryEntries");
      if (pendingEntries) {
        const parsedPending = JSON.parse(pendingEntries);
        const successfulUploads = [];

        for (const [dateKey, entry] of Object.entries(parsedPending)) {
          try {
            const response = await uploadDiaryToServer(
              entry.date,
              entry.text || "",
              entry.mood
            );
            if (response && response.ok) {
              successfulUploads.push(dateKey);
            }
          } catch (uploadError) {
            console.error(
              "Error uploading legacy entry:",
              dateKey,
              uploadError
            );
          }
        }

        // Remove successfully uploaded entries
        if (successfulUploads.length > 0) {
          const remainingPending = { ...parsedPending };
          successfulUploads.forEach((key) => delete remainingPending[key]);
          await AsyncStorage.setItem(
            "pendingDiaryEntries",
            JSON.stringify(remainingPending)
          );
        }
      }
    } catch (error) {
      console.error("Error syncing pending entries:", error);
    }
  };

  // Create emotion data mapping
  const createEmotionData = (mood, text) => {
    const moodOption = MOOD_OPTIONS.find((option) => option.emoji === mood);
    const emotionData = {
      id: Date.now().toString(),
      date: selectedDate,
      mood: mood || "",
      moodLabel: moodOption ? moodOption.label : "Unknown",
      text: text || "",
      timestamp: new Date().toISOString(),
      synced: false,
    };
    return emotionData;
  };

  // Save diary entry
  const saveDiaryEntry = async (mood, text) => {
    if (!selectedDate) {
      console.error("No selected date");
      Alert.alert("錯誤", "請先選擇日期");
      return;
    }

    if (!mood) {
      Alert.alert("錯誤", "請選擇一個表情");
      return;
    }

    try {
      const emotionData = createEmotionData(mood, text);
      const dateKey = selectedDate;

      const newEntries = {
        ...diaryEntries,
        [dateKey]: emotionData,
      };

      // Always save to local first (this is the most important step)
      setDiaryEntries(newEntries);
      await AsyncStorage.setItem("diaryEntries", JSON.stringify(newEntries));

      // Always cache locally for offline support
      await cacheMoodLocally(emotionData);

      // Close modal immediately after local save
      closeModal();

      // Background task: Try to upload to server (don't block UI)
      if (token) {
        // Don't await this - let it run in background
        uploadToServerInBackground(emotionData, dateKey);
      } else {
        // Not authenticated, add to pending
        addToPendingEntries(emotionData, dateKey);
      }
    } catch (error) {
      console.error("Error saving diary entry:", error);
      // Even if there's an error, try to save basic version locally
      try {
        const basicEntry = {
          id: Date.now().toString(),
          date: selectedDate,
          mood: mood,
          text: text || "",
          timestamp: new Date().toISOString(),
          synced: false,
        };
        const newEntries = {
          ...diaryEntries,
          [selectedDate]: basicEntry,
        };
        setDiaryEntries(newEntries);
        await AsyncStorage.setItem("diaryEntries", JSON.stringify(newEntries));
        closeModal();
        Alert.alert("已保存", "資料已保存到本地，稍後將嘗試同步到服務器");
      } catch (finalError) {
        console.error("Final save attempt failed:", finalError);
        closeModal(); // Close modal even if save fails
        Alert.alert("錯誤", "保存失敗，請檢查網路連接後重試");
      }
    }
  };

  // Background upload function
  const uploadToServerInBackground = async (emotionData, dateKey) => {
    try {
      const response = await uploadDiaryToServer(
        emotionData.date,
        emotionData.text || "",
        emotionData.mood
      );
      if (response && response.ok) {
        // Successfully uploaded, mark as synced
        emotionData.synced = true;
        const updatedEntries = {
          ...diaryEntries,
          [dateKey]: emotionData,
        };
        setDiaryEntries((prev) => ({
          ...prev,
          [dateKey]: { ...prev[dateKey], synced: true },
        }));
        await AsyncStorage.setItem(
          "diaryEntries",
          JSON.stringify(updatedEntries)
        );

        // Remove from pending cache since it's uploaded
        const pendingMoods = await AsyncStorage.getItem("pendingMoods");
        if (pendingMoods) {
          const pendingList = JSON.parse(pendingMoods);
          const filteredList = pendingList.filter(
            (entry) => entry.date !== emotionData.date
          );
          await AsyncStorage.setItem(
            "pendingMoods",
            JSON.stringify(filteredList)
          );
        }
      } else {
        await addToPendingEntries(emotionData, dateKey);
      }
    } catch (uploadError) {
      console.error("Background upload error:", uploadError);
      await addToPendingEntries(emotionData, dateKey);
    }
  };

  // Helper function to add to pending entries
  const addToPendingEntries = async (emotionData, dateKey) => {
    try {
      const pendingEntries = await AsyncStorage.getItem("pendingDiaryEntries");
      const parsedPending = pendingEntries ? JSON.parse(pendingEntries) : {};
      parsedPending[dateKey] = emotionData;
      await AsyncStorage.setItem(
        "pendingDiaryEntries",
        JSON.stringify(parsedPending)
      );
    } catch (error) {
      console.error("Error adding to pending entries:", error);
    }
  };

  // Calendar matrix calculation
  const updateCalendarMatrix = useCallback(() => {
    const matrix = getCalendarMatrix(currentDisplayYear, currentDisplayMonth);
    setCalendarMatrix(matrix);
  }, [currentDisplayYear, currentDisplayMonth]);

  // Initial loading
  useEffect(() => {
    loadDiaryEntries();
    updateCalendarMatrix();

    // Sync pending entries when component loads
    if (token) {
      setTimeout(() => {
        syncPendingEntries();
      }, 2000); // Give some time for initial loading
    }
  }, [updateCalendarMatrix, token]);

  useEffect(() => {
    updateCalendarMatrix();
  }, [currentDisplayMonth, currentDisplayYear, updateCalendarMatrix]);

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === "calendar" ? "history" : "calendar");
  };

  // Render history records list
  const renderHistoryList = () => {
    // Get current month's records
    const currentMonthEntries = Object.entries(diaryEntries)
      .filter(([dateKey]) => {
        const entryDate = new Date(dateKey);
        return (
          entryDate.getMonth() === currentDisplayMonth &&
          entryDate.getFullYear() === currentDisplayYear
        );
      })
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)); // Sort by date descending

    if (currentMonthEntries.length === 0) {
      return (
        <View style={styles.emptyHistoryContainer}>
          <Text style={styles.emptyHistoryText}>本月暫無記錄</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.historyContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentMonthEntries.map(([dateKey, entry]) => (
          <View key={dateKey} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyDate}>{dateKey}</Text>
              <Text style={styles.historyMood}>{entry.mood}</Text>
            </View>
            {entry.text && <Text style={styles.historyText}>{entry.text}</Text>}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <LinearGradient
      colors={[Theme.Colors.background, "#E8F4FD", Theme.Colors.surface]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        {...panGesture}
      >
        {/* Decorative background elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.floatingCircle, styles.circle1]} />
          <View style={[styles.floatingCircle, styles.circle2]} />
          <View style={[styles.floatingCircle, styles.circle3]} />
        </View>

        {/* Month switcher */}
        <Animated.View
          style={[styles.monthRow, { transform: [{ translateY: slideAnim }] }]}
        >
          <TouchableOpacity onPress={prevMonth} style={styles.arrowBtn}>
            <LinearGradient
              colors={[Theme.Colors.primary, Theme.Colors.secondary]}
              style={styles.arrowGradient}
            >
              <Text style={styles.arrowText}>‹</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {`${currentDisplayYear} / ${String(currentDisplayMonth + 1).padStart(2, "0")}`}
            </Text>
          </View>

          <TouchableOpacity onPress={nextMonth} style={styles.arrowBtn}>
            <LinearGradient
              colors={[Theme.Colors.primary, Theme.Colors.secondary]}
              style={styles.arrowGradient}
            >
              <Text style={styles.arrowText}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Calendar grid container or history records */}
        {viewMode === "calendar" ? (
          <>
            {/* Week header */}
            <View style={styles.weekHeader}>
              {["日", "一", "二", "三", "四", "五", "六"].map((w, index) => (
                <Animated.View
                  key={w}
                  style={[
                    styles.weekHeaderItem,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.weekHeaderText}>{w}</Text>
                </Animated.View>
              ))}
            </View>

            <View style={styles.calendarContainer}>
              <CalendarGrid
                calendarMatrix={calendarMatrix}
                moodData={diaryEntries}
                openModal={openModal}
              />
            </View>
          </>
        ) : (
          renderHistoryList()
        )}

        {/* Mood selection modal */}
        <MoodModal
          visible={modalVisible}
          date={selectedDate}
          selectedEmoji={tempSelectedEmoji}
          setSelectedEmoji={setTempSelectedEmoji} // Only update temp state, don't save
          inputText={tempInputText}
          setInputText={setTempInputText} // Only update temp state, don't save
          onCancel={closeModal}
          onSave={(mood, text) => {
            saveDiaryEntry(mood, text);
          }} // Only save when explicitly called
          allEmojis={MOOD_OPTIONS.map((m) => m.emoji)}
        />
      </Animated.View>

      {/* View mode toggle button */}
      <View style={styles.toggleButtonContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleViewMode}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#10b981", "#059669"]}
            style={styles.toggleButtonGradient}
          >
            <Text style={styles.toggleButtonText}>
              {viewMode === "calendar" ? "📋" : "📅"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Quick add button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => openModal(new Date().toISOString().slice(0, 10))}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Theme.Colors.primary, "#5A7A95"]}
            style={styles.fabGradient}
          >
            <Text style={styles.fabText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60, // Avoid dynamic island
  },
  decorativeElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingCircle: {
    position: "absolute",
    borderRadius: 50,
    opacity: 0.08,
  },
  circle1: {
    width: 100,
    height: 100,
    backgroundColor: Theme.Colors.primary,
    top: 80,
    right: 30,
  },
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: Theme.Colors.secondary,
    bottom: 200,
    left: 20,
  },
  circle3: {
    width: 60,
    height: 60,
    backgroundColor: Theme.Colors.accent,
    top: 180,
    left: 50,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  arrowBtn: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  arrowGradient: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    fontSize: 24,
    color: Theme.Colors.surface,
    fontWeight: "bold",
  },
  titleContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Theme.Colors.textPrimary,
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 1,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 1,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  emptyHistoryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontSize: 20,
    fontWeight: "700",
    color: Theme.Colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  historyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(120, 149, 178, 0.1)",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.Colors.primary,
    letterSpacing: 0.5,
  },
  historyMood: {
    fontSize: 28,
  },
  historyText: {
    fontSize: 15,
    color: Theme.Colors.textPrimary,
    lineHeight: 22,
    fontWeight: "400",
    letterSpacing: 0.2,
    marginTop: 4,
  },
  toggleButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  toggleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    overflow: "hidden",
  },
  toggleButtonGradient: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 28,
    lineHeight: 32,
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    left: width / 2 - 35,
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    overflow: "hidden",
  },
  fabGradient: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: {
    fontSize: 32,
    color: Theme.Colors.surface,
    lineHeight: 36,
    fontWeight: "bold",
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: 15,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  weekHeaderItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginHorizontal: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  weekHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.Colors.textPrimary,
  },
});
