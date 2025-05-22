import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { getCalendarMatrix } from "../lib/getCalendarMatrix";
import { getToken } from "@/lib/util/getToken";
import { cacheMoodLocally } from "@/lib/util/cacheMoodLocally";
import { saveDiary, getDiary } from "@/lib/api/diaryRequest";
import CalendarGrid from "@/components/diary/CalendarGrid";
import MoodModal from "@/components/diary/MoodModal";

const moodOptions = [
  { emoji: "😁", label: "開心" },
  { emoji: "🥰", label: "幸福" },
  { emoji: "😠", label: "生氣" },
  { emoji: "😢", label: "難過" },
  { emoji: "😞", label: "失望" },
];

export default function DiaryScreen() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(3);
  const [moodData, setMoodData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [inputText, setInputText] = useState("");
  const swipeHandledRef = useRef(false);
  const panResponder = PanResponder.create({
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
  });

  const nextMonth = () => {
    const nm = (currentMonth + 1) % 12;
    const ny = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(nm);
    setCurrentYear(ny);
  };

  const prevMonth = () => {
    const nm = currentMonth === 0 ? 11 : currentMonth - 1;
    const ny = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(nm);
    setCurrentYear(ny);
  };

  const openModal = (dateString) => {
    const existing = moodData[dateString] || { emoji: "", text: "" };
    setModalDate(dateString);
    setSelectedEmoji(existing.emoji);
    setInputText(existing.text);
    setModalVisible(true);
  };

  const saveMood = async () => {
    setModalVisible(false);
    if (!selectedEmoji) return;

    // Update UI immediately
    const updated = {
      ...moodData,
      [modalDate]: { emoji: selectedEmoji, text: inputText },
    };
    setMoodData(updated);

    const moodText =
      moodOptions.find((m) => m.emoji === selectedEmoji)?.label || "";

    const entry = {
      date: modalDate,
      diary: inputText,
      mood: moodText,
    };

    const token = await getToken();
    if (!token) {
      console.warn("No token found, caching mood locally");
      await cacheMoodLocally(entry);
      return;
    }

    try {
      const res = await saveDiary(modalDate, inputText, moodText);
      if (!res.ok) {
        if (res.status === 401) {
          console.warn("Token expired or unauthorized; caching mood locally");
        } else {
          console.warn(
            `Failed to save mood to server, status code: ${res.status}`
          );
        }
        await cacheMoodLocally(entry);
      }
    } catch (err) {
      console.error("Network error while saving mood; caching locally:", err);
      await cacheMoodLocally(entry);
    }
  };

  const calendarMatrix = getCalendarMatrix(currentYear, currentMonth);

  useEffect(() => {
    async function loadLogs() {
      try {
        const logs = await getDiary();
        if (!logs) return;
        const newMoodData = {};
        logs.forEach((entry) => {
          const emoji =
            moodOptions.find((m) => m.label === entry.mood)?.emoji || "";
          newMoodData[entry.date] = { emoji, text: entry.diary || "" };
        });
        setMoodData(newMoodData);
      } catch (err) {
        console.error("failed to load diary data:", err);
      }
    }

    loadLogs();
  }, []);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.monthRow}>
        <TouchableOpacity onPress={prevMonth} style={styles.arrowBtn}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {`${currentYear} / ${String(currentMonth + 1).padStart(2, "0")}`}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.arrowBtn}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekHeader}>
        {["日", "一", "二", "三", "四", "五", "六"].map((w) => (
          <Text style={styles.weekHeaderText} key={w}>
            {w}
          </Text>
        ))}
      </View>

      <CalendarGrid
        calendarMatrix={calendarMatrix}
        moodData={moodData}
        openModal={openModal}
      />

      <MoodModal
        visible={modalVisible}
        date={modalDate}
        selectedEmoji={selectedEmoji}
        setSelectedEmoji={setSelectedEmoji}
        inputText={inputText}
        setInputText={setInputText}
        onCancel={() => setModalVisible(false)}
        onSave={saveMood}
        allEmojis={moodOptions.map((m) => m.emoji)}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => openModal(new Date().toISOString().slice(0, 10))}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  arrowBtn: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  arrowText: {
    fontSize: 28,
    color: "#333",
    fontWeight: "bold",
  },
  title: { fontSize: 22, textAlign: "center", minWidth: 110 },
  weekHeader: { flexDirection: "row" },
  weekHeaderText: { flex: 1, textAlign: "center", fontWeight: "bold" },

  fab: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgb(193,196,192)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: "#fff",
    lineHeight: 36,
    fontWeight: "bold",
  },
});
