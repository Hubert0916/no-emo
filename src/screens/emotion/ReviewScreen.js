import { View, Text, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Emotion_Categories } from '@/screens/emotion/SelectEmojiScreen';
import { getRecommendation } from '@/lib/services/recommendationService';

export default function ReviewScreen({ route }) {
  const navigation = useNavigation();
  const selectedEmotions = route.params.selectedEmotions;
  const texts = selectedEmotions.map(e => e.emotion);

  const handleRecommendation = async () => {
    try {
      // Call weighted + random tie-breaking logic
      const recommendedActivity = await getRecommendation(selectedEmotions);
      // Navigate to next page with recommended activityId
      navigation.navigate('RecommendResultScreen', { 
        activityId: recommendedActivity 
      });
    } catch (error) {
      console.error('Error getting recommendation:', error);
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        你選擇的情緒（{selectedEmotions.length}/5）：
      </Text>

      <ScrollView style={{ marginBottom: 20 }}>
        {selectedEmotions.map((emotion, index) => (
          <Text
            key={`${emotion.emotion}-${index}`}
            style={{ fontSize: 18, marginBottom: 8 }}
          >
            {Emotion_Categories[emotion.category].emoji} {emotion.emotion}
          </Text>
        ))}
      </ScrollView>

      <View style={{ marginBottom: 10 }}>
        <Button title="返回修改" onPress={() => navigation.goBack()} />
      </View>

      <View>
        <Button
          title="下一步：推薦活動"
          onPress={handleRecommendation}
        />
      </View>
    </SafeAreaView>
  );
}