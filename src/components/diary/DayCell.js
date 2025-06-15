import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

export default function DayCell({ day, onPress, mood }) {
  // Check if date is in the future - compare dates only, not time
  const isFutureDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    
    const cellDate = new Date(dateString);
    cellDate.setHours(0, 0, 0, 0); // Set to start of day
    
    return cellDate > today;
  };

  const handlePress = () => {
    if (!isFutureDate(day.dateString)) {
      onPress(day.dateString);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.dayCell,
        isFutureDate(day.dateString) && styles.disabledDay
      ]}
      onPress={handlePress}
      disabled={isFutureDate(day.dateString)}
      activeOpacity={isFutureDate(day.dateString) ? 1 : 0.7}
    >
      <Text style={[
        styles.dayText, 
        !day.isCurrentMonth && styles.outMonth,
        isFutureDate(day.dateString) && styles.futureText
      ]}>
        {day.day}
      </Text>
      <View style={styles.emojiSlot}>
        <Text style={styles.emoji}>{mood?.mood || ""}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dayCell: { 
    flex: 1, 
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledDay: {
    opacity: 0.4,
    backgroundColor: 'rgba(200, 200, 200, 0.1)',
  },
  dayText: { 
    fontSize: 16,
    fontWeight: '500',
  },
  outMonth: { 
    color: "#ccc" 
  },
  futureText: {
    color: "#bbb",
  },
  emojiSlot: { 
    height: 20, 
    justifyContent: "center" 
  },
  emoji: { 
    fontSize: 18 
  },
});
