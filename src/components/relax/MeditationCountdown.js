import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import bellSound from '@/assets/Meditation Bell Sound 1.mp3';
import backgroundMusic from '@/assets/Meditation Sound April 8 2025.mp3';

export default function MeditationCountdown({ route, navigation }) {
  const { duration } = route.params;
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const bgmSoundRef = useRef(null); // Use useRef to store music instance

  useEffect(() => {
    // Initialize: play bell sound + music
    const initSound = async () => {
      const { sound: chime } = await Audio.Sound.createAsync(bellSound);
      await chime.playAsync();

      const { sound: bgm } = await Audio.Sound.createAsync(backgroundMusic, {
        isLooping: true,
        volume: 0.6,
      });
      bgmSoundRef.current = bgm;
      await bgm.playAsync();
    };

    initSound();

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigation.goBack();
        }
        return prev - 1;
      });
    }, 1000);

    // Clear background sound effects
    return () => {
      clearInterval(timer);
      if (bgmSoundRef.current) {
        bgmSoundRef.current.stopAsync();
        bgmSoundRef.current.unloadAsync();
      }
    };
  }, []);

  const formatTime = () => {
    const min = Math.floor(secondsLeft / 60);
    const sec = secondsLeft % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  timerText: { fontSize: 72, color: 'white', fontWeight: 'bold' },
});
