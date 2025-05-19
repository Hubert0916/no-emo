import { View, Text, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Emotion_Categories } from './SelectEmojiScreen';
import { recommendBestActivity } from '../recommendation';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewScreen({ route }) {
  const navigation = useNavigation();
  const selectedEmotions = route.params.selectedEmotions;
  const texts = selectedEmotions.map(e => e.emotion);

  const handleRecommend = () => {
    // 呼叫你的加權＋隨機平手邏輯
    const activityId = recommendBestActivity(texts);
    // 跳到下一頁，帶入推薦到的 activityId
    navigation.navigate('RecommendResult', { activityId });
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

      {/* 新增下一步按鈕 */}
      <View>
        <Button
          title="下一步：推薦活動"
          onPress={handleRecommend}
        />
      </View>
    </SafeAreaView>
  );
}