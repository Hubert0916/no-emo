import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { getCalendarMatrix } from "../lib/getCalendarMatrix";
import { saveDiary, getDiary } from "@/lib/api/diaryRequest";
import CalendarGrid from "@/components/diary/CalendarGrid";
import MoodModal from "@/components/diary/MoodModal";

export default function DiaryScreen() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(3);
  const [moodData, setMoodData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [inputText, setInputText] = useState("");
  const allEmojis = ["😁", "🥰", "😠", "😢", "😞"];
  const emojiMap = {
    "😁": "開心",
    "🥰": "幸福",
    "😠": "生氣",
    "😢": "難過",
    "😞": "失望",
  };

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
    if (selectedEmoji) {
      const updated = {
        ...moodData,
        [modalDate]: { emoji: selectedEmoji, text: inputText },
      };
      setMoodData(updated);

      const moodText = emojiMap[selectedEmoji];

      try {
        const res = await saveDiary(modalDate, moodText, inputText);
        if (!res.ok) {
          console.error("fail to save mood:", await res.text());
        }
      } catch (err) {
        console.error("error occurs when saving mood:", err);
      }
    }
  };

  const calendarMatrix = getCalendarMatrix(currentYear, currentMonth);

  useEffect(() => {
    async function loadLogs() {
      try {
        const logs = await getDiary();
        const newMoodData = {};
        logs.forEach((entry) => {
          const emoji =
            Object.entries(emojiMap).find(
              ([_, label]) => label === entry.mood
            )?.[0] || "";
          newMoodData[entry.date] = { emoji, text: "" };
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
        allEmojis={allEmojis}
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
