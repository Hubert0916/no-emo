import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Theme from '@/lib/theme';


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
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.Spacing.xl,
    backgroundColor: Theme.Colors.background,
  },
  title: {
    fontSize: Theme.Fonts.sizes.xl,
    fontWeight: Theme.Fonts.weights.bold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.xxl,
  },
  option: {
    backgroundColor: Theme.Colors.surface,
    padding: Theme.Spacing.xl,
    borderRadius: Theme.BorderRadius.xl,
    marginVertical: Theme.Spacing.sm,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  optionText: {
    fontSize: Theme.Fonts.sizes.lg,
    fontWeight: Theme.Fonts.weights.medium,
    color: Theme.Colors.textPrimary,
  },
});
