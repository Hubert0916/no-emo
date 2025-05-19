import { View, Animated, StyleSheet } from 'react-native';
import DayCell from './DayCell';

export default function CalendarGrid({ panHandlers, calendarMatrix, moodData, openModal }) {
  return (
    <Animated.View {...panHandlers}>
      {calendarMatrix.map((week, i) => (
        <View style={styles.weekRow} key={i}>
          {week.map(day => (
            <DayCell
              key={day.dateString}
              day={day}
              mood={moodData[day.dateString]}
              onPress={openModal}
            />
          ))}
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  weekRow: { flexDirection: 'row', marginVertical: 5 },
});