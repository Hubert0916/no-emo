import { View, Text, StyleSheet, PanResponder} from 'react-native';
import { useState, useRef } from 'react';
import { getCalendarMatrix } from '../components/Calendar';
import CalendarGrid from '../components/CalendarGrid';
import MoodModal from '../components/MoodModal';

export default function DiaryScreen() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(3);
  const [moodData, setMoodData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDate, setModalDate] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [inputText, setInputText] = useState('');
  const allEmojis = ['😁', '🥰', '😐', '😢', '😞'];

  const swipeHandledRef = useRef(false);
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 20,
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { swipeHandledRef.current = false },
    onPanResponderRelease: (_, g) => {
      if (!swipeHandledRef.current) {
        if (g.dx > 30 || g.vx > 0.5) prevMonth();
        else if (g.dx < -30 || g.vx < -0.5) nextMonth();
        swipeHandledRef.current = true;
      }
    }
  });

  const nextMonth = () => {
    const nm = (currentMonth + 1) % 12;
    const ny = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(nm); setCurrentYear(ny);
  };

  const prevMonth = () => {
    const nm = currentMonth === 0 ? 11 : currentMonth - 1;
    const ny = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(nm); setCurrentYear(ny);
  };

  const openModal = (dateString) => {
    const existing = moodData[dateString] || { emoji: '', text: '' };
    setModalDate(dateString);
    setSelectedEmoji(existing.emoji);
    setInputText(existing.text);
    setModalVisible(true);
  };

  const saveMood = () => {
    setModalVisible(false);
    if (selectedEmoji) {
      setMoodData(prev => ({ ...prev, [modalDate]: { emoji: selectedEmoji, text: inputText } }));
    }
  };

  const calendarMatrix = getCalendarMatrix(currentYear, currentMonth);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${currentYear} / ${String(currentMonth + 1).padStart(2, '0')}`}</Text>
      <View style={styles.weekHeader}>
        {['日', '一', '二', '三', '四', '五', '六'].map(w => (
          <Text style={styles.weekHeaderText} key={w}>{w}</Text>
        ))}
      </View>
      <CalendarGrid
        panHandlers={panResponder.panHandlers}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, textAlign: 'center', marginTop: 40, marginBottom: 10 },
  weekHeader: { flexDirection: 'row' },
  weekHeaderText: { flex: 1, textAlign: 'center', fontWeight: 'bold' },
});