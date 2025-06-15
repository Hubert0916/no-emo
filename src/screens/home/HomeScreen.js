import { Text, View, Image, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from "react-native";
import CloudAnimation from "@/components/home/Cloud";
import { useNavigation } from "@react-navigation/core";
import Theme from '@/lib/theme';

const { height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.Colors.background} />
      <Image
        source={require("@/assets/gradient.png")}
        style={styles.backgroundImage} 
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>
          今天好嗎?
        </Text>
        
        <View style={styles.cloudContainer}>
          <CloudAnimation />
        </View>
        
        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => navigation.navigate("SelectEmoji")}
        >
          <Text style={styles.bigButtonText}>立即放鬆！</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: screenHeight * 0.08,
    paddingBottom: screenHeight * 0.12,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: Theme.Fonts.sizes.xxl * 1.5, 
    color: Theme.Colors.surface, 
    fontWeight: Theme.Fonts.weights.bold, 
    textShadowColor: 'rgba(0, 0, 0, 0.25)', 
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  cloudContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: 200,
  },
  bigButton: {
    width: 220,
    height: 65,
    borderRadius: Theme.BorderRadius.xl * 2, 
    backgroundColor: Theme.Colors.primary, 
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: Theme.Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bigButtonText: {
    fontSize: Theme.Fonts.sizes.lg,
    fontWeight: Theme.Fonts.weights.semibold,
    color: Theme.Colors.surface,
  },
});
