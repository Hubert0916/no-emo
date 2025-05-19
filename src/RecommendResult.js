import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

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
    // icon: require('../assets/meditate.png'),
  },
};

export default function RecommendResult() {
  const route = useRoute();
  const navigation = useNavigation();
  const { activityId } = route.params || {};

  // 2. 拿到這次要展示的活動資訊
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
    padding: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 40,
  },
  icon: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
  },
  desc: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});
