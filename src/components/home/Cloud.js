import { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

const CloudAnimation = () => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -30,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [translateY]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("@/assets/cloud.png")}
        style={[
          styles.cloud,
          {
            transform: [{ translateY }],
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  cloud: {
    width: 280,
    height: 160,
    resizeMode: 'contain',
  },
});

export default CloudAnimation;
