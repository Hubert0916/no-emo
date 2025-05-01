import { Button } from '@react-navigation/elements';
import { Text, View, Image} from 'react-native';
import CloudAnimation from './components/Cloud';
import { useNavigation } from '@react-navigation/core';


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
      <Button
        onPress={() => navigation.navigate("SelectEmoji")}
        style={{ position: "absolute", bottom: "20%" }}
      >
        立即放鬆！
      </Button>
    </View>
  );
}
