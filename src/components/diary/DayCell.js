import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function DayCell({ day, onPress, mood }) {
  return (
    <TouchableOpacity style={styles.dayCell} onPress={() => onPress(day.dateString)}>
      <Text style={[styles.dayText, !day.isCurrentMonth && styles.outMonth]}>
        {day.day}
      </Text>
      <View style={styles.emojiSlot}>
        <Text style={styles.emoji}>{mood?.emoji || ''}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dayCell: { flex: 1, alignItems: 'center' },
  dayText: { fontSize: 16 },
  outMonth: { color: '#ccc' },
  emojiSlot: { height: 20, justifyContent: 'center' },
  emoji: { fontSize: 18 },
});