import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Theme from '../../Theme';


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
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.neutralBackground, // ⬅️ 淺灰背景
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.Spacing.xl,
  },
  title: {
    fontSize: Theme.Fonts.sizes.xl,
    fontWeight: Theme.Fonts.weights.bold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.xl,
  },
  option: {
    backgroundColor: Theme.Colors.surface, // ⬅️ 白色按鈕
    paddingVertical: Theme.Spacing.lg,
    paddingHorizontal: Theme.Spacing.xl,
    borderRadius: Theme.BorderRadius.lg,
    marginVertical: Theme.Spacing.sm,
    width: '100%',
    alignItems: 'center',

    // 陰影效果
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: Theme.Fonts.sizes.lg,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Fonts.weights.medium,
  },
});
