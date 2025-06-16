import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Theme from '../Theme';


// 1. 活動資料對照表：ID → 詳細資訊
const activityData = {
  food: {
    title: '吃點喜歡的食物',
    description: '挑一份你最愛的小點心，讓心情溫暖起來。',
    // icon: require('../assets/food.png'),
  },
  musicRecommendation: {
    title: '音樂推薦',
    description: '播放一首撫慰心靈的好歌。',
    // icon: require('../assets/music.png'),
  },
  cleanUpRoom: {
    title: '整理房間',
    description: '把環境打理乾淨，讓思緒更清晰。',
    // icon: require('../assets/clean.png'),
  },
  watchMovie: {
    title: '看部電影',
    description: '當沙發馬鈴薯，放空自己一會兒。',
    // icon: require('../assets/movie.png'),
  },
  meditation: {
    title: '冥想',
    description: '靜坐 5 分鐘，做深呼吸放鬆身心。',
  },
};

export default function RecommendResult() {
  const route = useRoute();
  const navigation = useNavigation();
  const { activityId } = route.params || {};

  const info = activityData[activityId] || {};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🎉 推薦活動</Text>

      <View style={styles.card}>
        <Image source={info.icon} style={styles.icon} />
        <View style={styles.textBox}>
          <Text style={styles.title}>{info.title}</Text>
          <Text style={styles.desc}>{info.description}</Text>
        </View>
      </View>

    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.popToTop()}
    >
      <Text style={styles.buttonText}>重新選擇情緒</Text>
    </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.Spacing.xxl,
    backgroundColor: Theme.Colors.background,
    justifyContent: 'center',
  },
  header: {
    fontSize: Theme.Fonts.sizes.xxl,
    fontWeight: Theme.Fonts.weights.bold,
    textAlign: 'center',
    marginBottom: Theme.Spacing.xl,
    color: Theme.Colors.textPrimary,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Theme.ActivityStyle.cardBackground,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.lg,
    alignItems: 'center',
    ...Theme.ActivityStyle.cardShadow,
    marginBottom: Theme.Spacing.xxl,
  },
  icon: {
    width: 64,
    height: 64,
    marginRight: Theme.Spacing.md,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: Theme.Fonts.sizes.xl,
    fontWeight: Theme.Fonts.weights.semibold,
    marginBottom: Theme.Spacing.xs,
    color: Theme.Colors.textPrimary,
  },
  desc: {
    fontSize: Theme.Fonts.sizes.md,
    color: Theme.Colors.textSecondary,
  },
  button: {
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.xl,
    borderRadius: Theme.BorderRadius.md,
    alignItems: 'center',
    marginTop: Theme.Spacing.md,
  },
  buttonText: {
    color: '#fff',
    fontSize: Theme.Fonts.sizes.md,
    fontWeight: Theme.Fonts.weights.medium,
  },
});
