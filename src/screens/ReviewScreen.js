import { View, Text, ScrollView, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Emotion_Categories } from './SelectEmojiScreen';
import { recommendBestActivity } from '@/screens/recommendation';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '../Theme';
import { StyleSheet } from 'react-native';



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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        你選擇的情緒（{selectedEmotions.length}/5）：
      </Text>

      <ScrollView style={styles.scroll}>
        {selectedEmotions.map((emotion, index) => (
          <Text key={`${emotion.emotion}-${index}`} style={styles.emotionText}>
            {Emotion_Categories[emotion.category].emoji} {emotion.emotion}
          </Text>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>返回修改</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButton} onPress={handleRecommend}>
        <Text style={styles.buttonText}>下一步：推薦活動</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.Spacing.xl,
    backgroundColor: Theme.Colors.background,
  },
  title: {
    fontSize: Theme.Fonts.sizes.lg,
    fontWeight: Theme.Fonts.weights.bold,
    marginBottom: Theme.Spacing.md,
    color: Theme.Colors.textPrimary,
  },
  scroll: {
    marginBottom: Theme.Spacing.md,
  },
  emotionText: {
    fontSize: Theme.Fonts.sizes.md,
    marginBottom: Theme.Spacing.sm,
    color: Theme.Colors.textPrimary,
  },
  backButton: {
    backgroundColor: Theme.Colors.border,
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.md,
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  nextButton: {
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: Theme.Fonts.sizes.md,
    fontWeight: Theme.Fonts.weights.bold,
  },
});
