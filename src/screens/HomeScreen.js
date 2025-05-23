import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import CloudAnimation from "../components/Cloud";
import { useNavigation } from "@react-navigation/core";

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
  title: {
    fontSize: 48,
    color: "white",
    marginTop: "20%",
  },
  bigButton: {
    position: "absolute",
    bottom: "20%",
    width: 200,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#c9bfa5", // 你喜歡的底色
    justifyContent: "center",
    alignItems: "center",
    elevation: 4, // Android 陰影
    shadowColor: "#000", // iOS 陰影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bigButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
});
