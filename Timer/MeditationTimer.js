import React, { useState, useRef, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';

import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Image
  } from 'react-native';
  import { Audio } from 'expo-av';

import bellSound from '../assets/Meditation Bell Sound 1.mp3';
import backgroundMusic from '../assets/Meditation Sound April 8 2025.mp3'; 

export default function MeditationTimer() {
    const navigation = useNavigation();
  const [duration, setDuration] = useState(10); // 分鐘
  const [isPlaying, setIsPlaying] = useState(false);
  const bgmSoundRef = useRef(null);

  const playChime = async () => {
    const { sound } = await Audio.Sound.createAsync(bellSound);
    await sound.playAsync();
  };

  const startMeditation = async () => {
    navigation.navigate('MeditationCountdown', { duration });
  };
  

  const stopMeditation = async () => {
    if (bgmSoundRef.current) {
      await bgmSoundRef.current.stopAsync();
      await bgmSoundRef.current.unloadAsync();
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      if (bgmSoundRef.current) {
        bgmSoundRef.current.unloadAsync();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>冥想時間</Text>
      <View style={styles.sliderRow}>
        <Slider
          style={{ flex: 1 }}
          minimumValue={1}
          maximumValue={60}
          step={1}
          value={duration}
          onValueChange={setDuration}
        />
        <Text style={styles.durationText}>{duration} 分鐘</Text>
      </View>

      <Text style={styles.label}>背景音樂</Text>
      <ScrollView horizontal style={{ marginVertical: 12 }}>
        <View style={styles.soundItem}>
          <Image source={require('../assets/forest.jpeg')} style={styles.soundImage} />
          <Text>森林</Text>
        </View>
        {/* 你可以放更多背景圖 */}
      </ScrollView>

      <TouchableOpacity
        style={[styles.startButton, isPlaying && styles.stopButton]}
        onPress={isPlaying ? stopMeditation : startMeditation}
      >
        <Text style={styles.startButtonText}>
          {isPlaying ? '結束冥想' : '開始冥想'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  label: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  sliderRow: { flexDirection: 'row', alignItems: 'center' },
  durationText: { marginLeft: 10, fontSize: 16, color: 'tomato' },

  soundItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  soundImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 6,
  },

  startButton: {
    marginTop: 40,
    backgroundColor: '#2a82ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#d33',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
