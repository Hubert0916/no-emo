import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import bellSound from '../../assets/Meditation Bell Sound 1.mp3';
import backgroundMusic from '../../assets/Meditation Sound April 8 2025.mp3';

export default function MeditationCountdown({ route, navigation }) {
  const { duration } = route.params;
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const bgmSoundRef = useRef(null); // ✅ 使用 useRef 儲存音樂實例

  useEffect(() => {
    // 初始化：播放鈴聲 + 音樂
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

    // ✅ 清除背景音效
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
