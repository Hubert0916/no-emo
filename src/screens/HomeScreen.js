import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import CloudAnimation from "../components/Cloud";
import { useNavigation } from "@react-navigation/core";
import Theme from '../Theme';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("../assets/gradient.png")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <Text style={{ fontSize: 48, color: "white", top: "20%" }}>
        今天好嗎?
      </Text>
      <CloudAnimation />
      <TouchableOpacity
        style={styles.bigButton}
        onPress={() => navigation.navigate("SelectEmoji")}
      >
        <Text style={styles.bigButtonText}>立即放鬆！</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // 如果背景漸層圖不是全螢幕，你可能需要設定背景色
    // backgroundColor: Theme.Colors.background,
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
  title: {
    fontSize: Theme.Fonts.sizes.xxl * 1.5, 
    color: Theme.Colors.surface, 
    marginTop: "20%",
    fontWeight: Theme.Fonts.weights.bold, 
    textShadowColor: 'rgba(0, 0, 0, 0.25)', 
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  bigButton: {
    position: "absolute",
    bottom: "20%", 
    width: 200,
    height: 60,
    borderRadius: Theme.BorderRadius.xl * 2, 
    backgroundColor: Theme.Colors.primary, 
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: Theme.Colors.textPrimary, // "#000"
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bigButtonText: {
    fontSize: Theme.Fonts.sizes.lg, // 20
    fontWeight: Theme.Fonts.weights.semibold, // "600"
    color: Theme.Colors.surface, // "#fff"
  },
});
