import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';

import { getCalendarMatrix } from "@/lib/util/getCalendarMatrix";
import { cacheMoodLocally } from "@/lib/util/cacheMoodLocally";
import {
  uploadDiaryToServer,
  fetchDiaryFromServer,
} from "@/lib/api/diaryRequest";
import CalendarGrid from "@/components/diary/CalendarGrid";
import MoodModal from "@/components/diary/MoodModal";
import { useAuth } from "@/contexts/AuthContext";
import Theme from '@/lib/theme';

// Mood options constants
const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🥳', label: 'Excited' },
];

const { width, height } = Dimensions.get('window');

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
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'history'
  
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
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDate(null);
  };

  // Data loading functions
  const loadDiaryEntries = async () => {
    try {
      setIsLoading(true);
      const storedEntries = await AsyncStorage.getItem('diaryEntries');
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries);
        setDiaryEntries(parsedEntries);
      }

      const pendingEntries = await AsyncStorage.getItem('pendingDiaryEntries');
      if (pendingEntries) {
        const parsedPending = JSON.parse(pendingEntries);
        setDiaryEntries(prev => ({ ...prev, ...parsedPending }));
      }
    } catch (error) {
      console.error('Error loading diary entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync pending upload data
  const syncPendingEntries = async () => {
    try {
      const pendingEntries = await AsyncStorage.getItem('pendingDiaryEntries');
      if (pendingEntries) {
        const parsedPending = JSON.parse(pendingEntries);
        // Here you would typically sync with your backend
        console.log('Syncing pending entries:', parsedPending);
      }
    } catch (error) {
      console.error('Error syncing pending entries:', error);
    }
  };

  // Create emotion data mapping
  const createEmotionData = (mood, text) => {
    const moodOption = MOOD_OPTIONS.find(option => option.emoji === mood);
    return {
      id: Date.now().toString(),
      date: selectedDate,
      mood: mood,
      moodLabel: moodOption ? moodOption.label : 'Unknown',
      text: text || '',
      timestamp: new Date().toISOString(),
      synced: false
    };
  };

  // Save diary entry
  const saveDiaryEntry = async (mood, text) => {
    try {
      const emotionData = createEmotionData(mood, text);
      const dateKey = selectedDate;
      
      const newEntries = {
        ...diaryEntries,
        [dateKey]: emotionData
      };
      
      setDiaryEntries(newEntries);
      
      await AsyncStorage.setItem('diaryEntries', JSON.stringify(newEntries));
      
      const pendingEntries = await AsyncStorage.getItem('pendingDiaryEntries');
      const parsedPending = pendingEntries ? JSON.parse(pendingEntries) : {};
      parsedPending[dateKey] = emotionData;
      
      await AsyncStorage.setItem('pendingDiaryEntries', JSON.stringify(parsedPending));
      
      closeModal();
      
      setTimeout(() => {
        syncPendingEntries();
      }, 1000);
      
    } catch (error) {
      console.error('Error saving diary entry:', error);
      Alert.alert('Error', 'Failed to save diary entry');
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
  }, [updateCalendarMatrix]);

  useEffect(() => {
    updateCalendarMatrix();
  }, [currentDisplayMonth, currentDisplayYear, updateCalendarMatrix]);

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'calendar' ? 'history' : 'calendar');
  };

  // Render history records list
  const renderHistoryList = () => {
    // Get current month's records
    const currentMonthEntries = Object.entries(diaryEntries)
      .filter(([dateKey]) => {
        const entryDate = new Date(dateKey);
        return entryDate.getMonth() === currentDisplayMonth && 
               entryDate.getFullYear() === currentDisplayYear;
      })
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)); // Sort by date descending

    if (currentMonthEntries.length === 0) {
      return (
        <View style={styles.emptyHistoryContainer}>
          <Text style={styles.emptyHistoryText}>No records this month</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
        {currentMonthEntries.map(([dateKey, entry]) => (
          <View key={dateKey} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyDate}>{dateKey}</Text>
              <Text style={styles.historyMood}>{entry.mood}</Text>
            </View>
            {entry.text && (
              <Text style={styles.historyText}>{entry.text}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <LinearGradient
      colors={[Theme.Colors.background, '#E8F4FD', Theme.Colors.surface]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
        {...panGesture}
      >
        {/* 裝飾性背景元素 */}
        <View style={styles.decorativeElements}>
          <View style={[styles.floatingCircle, styles.circle1]} />
          <View style={[styles.floatingCircle, styles.circle2]} />
          <View style={[styles.floatingCircle, styles.circle3]} />
        </View>

        {/* 月份切換器 */}
        <Animated.View 
          style={[
            styles.monthRow,
            { transform: [{ translateY: slideAnim }] }
          ]}
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

        {/* 日曆網格容器或歷史記錄 */}
        {viewMode === 'calendar' ? (
          <>
            {/* 週標頭 */}
            <View style={styles.weekHeader}>
              {["日", "一", "二", "三", "四", "五", "六"].map((w, index) => (
                <Animated.View
                  key={w}
                  style={[
                    styles.weekHeaderItem,
                    {
                      opacity: fadeAnim,
                      transform: [{
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }]
                    }
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

        {/* 情緒選擇彈窗 */}
        <MoodModal
          visible={modalVisible}
          date={selectedDate}
          selectedEmoji={diaryEntries[selectedDate]?.mood}
          setSelectedEmoji={(emoji) => saveDiaryEntry(emoji, diaryEntries[selectedDate]?.text)}
          inputText={diaryEntries[selectedDate]?.text}
          setInputText={(text) => saveDiaryEntry(diaryEntries[selectedDate]?.mood, text)}
          onCancel={closeModal}
          onSave={saveDiaryEntry}
          allEmojis={MOOD_OPTIONS.map((m) => m.emoji)}
        />
      </Animated.View>

      {/* 視圖切換按鈕 */}
      <View style={styles.toggleButtonContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleViewMode}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.toggleButtonGradient}
          >
            <Text style={styles.toggleButtonText}>
              {viewMode === 'calendar' ? '📋' : '📅'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 快速新增按鈕 */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => openModal(new Date().toISOString().slice(0, 10))}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Theme.Colors.primary, '#5A7A95']}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingCircle: {
    position: 'absolute',
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
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  arrowGradient: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: Theme.Colors.surface,
    fontWeight: "bold",
  },
  titleContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    fontWeight: 'bold',
    color: Theme.Colors.textPrimary,
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 149, 178, 0.1)',
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
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
    fontWeight: '400',
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
    overflow: 'hidden',
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
    overflow: 'hidden',
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
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
