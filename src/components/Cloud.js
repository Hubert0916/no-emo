import { useEffect, useRef } from "react";
import { Animated } from "react-native";

const CloudAnimation = () => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -30,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [translateY]);

  return (
    <Animated.Image
      source={require("../assets/cloud.png")}
      style={{
        width: 168,
        height: 100,
        position: "absolute",
        top: "45%",
        transform: [{ translateY }],
      }}
    />
  );
};

export default CloudAnimation;
