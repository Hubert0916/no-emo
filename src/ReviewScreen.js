import React from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Emotion_Categories } from './Selectemoji';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewScreen({ route }) {
  const navigation = useNavigation();
  const selectedEmotions = route.params.selectedEmotions;

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        你選擇的情緒（{selectedEmotions.length}/5）：
      </Text>

      <ScrollView style={{ marginBottom: 20 }}>
        {selectedEmotions.map((emotion, index) => (
          <Text key={`${emotion.emotion}-${index}`} style={{ fontSize: 18, marginBottom: 8 }}>
            {Emotion_Categories[emotion.category].emoji} {emotion.emotion}
          </Text>
        ))}
      </ScrollView>

      <View style={{ marginBottom: 10 }}>
        <Button title="返回修改" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}
