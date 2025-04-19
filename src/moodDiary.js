import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  PanResponder, Animated, Modal, TextInput, ScrollView, Button
} from 'react-native';

function getCalendarMatrix(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayWeekIndex = firstDayOfMonth.getDay();
  const weeks = [];
  let currentDayCounter = 1 - firstDayWeekIndex;
  for (let row = 0; row < 6; row++) {
    const weekRow = [];
    for (let col = 0; col < 7; col++) {
      const dt = new Date(year, month, currentDayCounter);
      weekRow.push({
        year: dt.getFullYear(),
        month: dt.getMonth(),
        day: dt.getDate(),
        isCurrentMonth: dt.getMonth() === month,
        dateString: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`,
      });
      currentDayCounter++;
    }
    weeks.push(weekRow);
  }
  return weeks;
}

export default function MoodDiary() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(3);
  // moodData: { 'YYYY-MM-DD': { emoji: '😊', text: '...' } }
  const [moodData, setMoodData] = useState({
    '2025-04-01': { emoji: '😊', text: '' },
    '2025-04-02': { emoji: '😢', text: '' },
    '2025-04-03': { emoji: '😎', text: '' },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalDate, setModalDate] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [inputText, setInputText] = useState('');

  const swipeHandledRef = useRef(false);
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 20,
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { swipeHandledRef.current = false; },
    onPanResponderRelease: (_, g) => {
      if (!swipeHandledRef.current) {
        if (g.dx > 30 || g.vx > 0.5) {
          prevMonth();
          swipeHandledRef.current = true;
        } else if (g.dx < -30 || g.vx < -0.5) {
          nextMonth();
          swipeHandledRef.current = true;
        }
      }
    },
  });

  const nextMonth = () => {
    let nm = currentMonth + 1, ny = currentYear;
    if (nm > 11) { nm = 0; ny++ }
    setCurrentMonth(nm); setCurrentYear(ny);
  };
  const prevMonth = () => {
    let nm = currentMonth - 1, ny = currentYear;
    if (nm < 0) { nm = 11; ny-- }
    setCurrentMonth(nm); setCurrentYear(ny);
  };

  const calendarMatrix = getCalendarMatrix(currentYear, currentMonth);

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
      setMoodData(prev => ({
        ...prev,
        [modalDate]: { emoji: selectedEmoji, text: inputText }
      }));
    }
  };

  const allEmojis = ['😁', '🥰', '😐', '😢', '😞'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {`${currentYear} / ${String(currentMonth + 1).padStart(2, '0')}`}
      </Text>
      <View style={styles.weekHeader}>
        {['日', '一', '二', '三', '四', '五', '六'].map(w => (
          <Text style={styles.weekHeaderText} key={w}>{w}</Text>
        ))}
      </View>
      <Animated.View {...panResponder.panHandlers}>
        {calendarMatrix.map((week, i) => (
          <View style={styles.weekRow} key={i}>
            {week.map(day => {
              const md = moodData[day.dateString];
              return (
                <TouchableOpacity
                  style={styles.dayCell}
                  key={day.dateString}
                  onPress={() => openModal(day.dateString)}
                >
                  <Text style={[styles.dayText, !day.isCurrentMonth && styles.outMonth]}>
                    {day.day}
                  </Text>
                  <View style={styles.emojiSlot}>
                    <Text style={styles.emoji}>{md?.emoji || ''}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </Animated.View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalMask}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{modalDate}</Text>
            <Text style={styles.modalPrompt}>今天的心情？：</Text>
            <View style={styles.emojiChooser}>
              {allEmojis.map(e => (
                <TouchableOpacity
                  key={e}
                  style={[
                    styles.emojiOption,
                    selectedEmoji === e && styles.emojiSelected
                  ]}
                  onPress={() => setSelectedEmoji(e)}
                >
                  <Text style={styles.emoji}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.modalPrompt}>描述今天的心情～</Text>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="輸入文字..."
              style={styles.input}
            />
            <View style={styles.modalBtns}>
              <Button title="取消" onPress={() => setModalVisible(false)} />
              <Button title="儲存" onPress={saveMood} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, textAlign: 'center', marginTop: 40, marginBottom: 10 },
  weekHeader: { flexDirection: 'row' },
  weekHeaderText: { flex: 1, textAlign: 'center', fontWeight: 'bold' },
  weekRow: { flexDirection: 'row', marginVertical: 5 },
  dayCell: { flex: 1, alignItems: 'center' },
  dayText: { fontSize: 16 },
  outMonth: { color: '#ccc' },
  emojiSlot: { height: 20, justifyContent: 'center' },
  emoji: { fontSize: 18 },
  modalMask: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center'
  },
  modalBox: {
    width: '80%', backgroundColor: '#fff', borderRadius: 8,
    padding: 16
  },
  modalTitle: { fontSize: 18, textAlign: 'center', marginBottom: 10 },
  modalPrompt: { marginTop: 8 },
  emojiChooser: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  emojiOption: {
    padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 4
  },
  emojiSelected: {
    borderColor: 'blue'
  },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 4,
    padding: 8, marginTop: 4
  },
  modalBtns: {
    flexDirection: 'row', justifyContent: 'space-around', marginTop: 12
  },
});