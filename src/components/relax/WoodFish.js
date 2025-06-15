import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Vibration, Animated, Image } from 'react-native';

export default function WoodFish() {
  const [count, setCount] = useState(0);
  const stickAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const handlePress = () => {
    Vibration.vibrate(50);
    setCount(count + 1);

    Animated.sequence([
      Animated.timing(stickAnim, {
        toValue: { x: -60, y: 40 }, // Animation direction adjustment
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(stickAnim, {
        toValue: { x: 0, y: 0 },
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>可敲的木魚</Text>

      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.imageBox}>
          {/* 木魚圖 */}
          <Image source={require('@/assets/woodfish.png')} style={styles.woodfish} />

          {/* 棒子動畫圖 */}
          <Animated.Image
            source={require('@/assets/stick.png')}
            style={[
              styles.stick,
              {
                transform: [
                  { translateX: stickAnim.x },
                  { translateY: stickAnim.y },
                  { rotate: '30deg' }, // Angle adjustment
                ],
              },
            ]}
          />
        </View>
      </TouchableWithoutFeedback>

      <Text style={styles.counter}>敲擊次數：{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  title: { fontSize: 24, marginBottom: 20 },
  imageBox: {
    position: 'relative',
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  woodfish: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  stick: {
    position: 'absolute',
    width: 80,
    height: 80,
    top: -10, // Start from top right corner
    right: -10,
    resizeMode: 'contain',
  },
  counter: { fontSize: 18 },
});
