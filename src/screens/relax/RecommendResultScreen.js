import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

// Activity data mapping: ID → detailed information
const ACTIVITY_DATA = {
  food: {
    title: 'Enjoy Favorite Food',
    description: 'Treat yourself to something delicious and comforting',
    color: '#FF6B6B',
    emoji: '🍽️',
  },
  meditation: {
    title: 'Meditation',
    description: 'Find inner peace through mindful breathing',
    color: '#4ECDC4',
    emoji: '🧘',
  },
  cleanUpRoom: {
    title: 'Clean Up Room',
    description: 'Organize your space for a clearer mind',
    color: '#45B7D1',
    emoji: '🧹',
  },
  watchMovie: {
    title: 'Watch Movie',
    description: 'Relax and enjoy some entertainment',
    color: '#96CEB4',
    emoji: '🎬',
  },
  musicRecommendation: {
    title: 'Soothing Music',
    description: 'Listen to calming melodies',
    color: '#FFEAA7',
    emoji: '🎵',
  },
  goForAWalk: {
    title: '10-Minute Walk',
    description: 'Get some fresh air and light exercise',
    color: '#DDA0DD',
    emoji: '🚶',
  },
};

export default function RecommendResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { activityId } = route.params || {};

  // Get activity information
  const activityInfo = ACTIVITY_DATA[activityId] || {};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🎉 推薦活動</Text>

      <View style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: activityInfo.color }]}>
          <Text style={styles.emoji}>{activityInfo.emoji}</Text>
        </View>
        <View style={styles.textBox}>
          <Text style={styles.title}>{activityInfo.title}</Text>
          <Text style={styles.desc}>{activityInfo.description}</Text>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 28,
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