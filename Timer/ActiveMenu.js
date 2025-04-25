import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function MenuPage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>選擇一個活動</Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('MeditationTimer')}
      >
        <Text style={styles.optionText}>冥想</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('WoodFish')}
      >
        <Text style={styles.optionText}>木魚</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32 },
  option: {
    backgroundColor: '#eee',
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  optionText: { fontSize: 20 },
});
