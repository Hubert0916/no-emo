import { useState, useRef, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import Theme from '@/lib/theme';

import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Image
  } from 'react-native';
import { Audio } from 'expo-audio';
import bellSound from '@/assets/Meditation Bell Sound 1.mp3';
import backgroundMusic from '@/assets/Meditation Sound April 8 2025.mp3'; 

export default function MeditationTimer() {
    const navigation = useNavigation();
  const [duration, setDuration] = useState(10); // minutes
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
      <Text style={styles.label}>Meditation Time</Text>
      <View style={styles.sliderRow}>
        <Slider
          style={{ flex: 1 }}
          minimumValue={1}
          maximumValue={60}
          step={1}
          value={duration}
          onValueChange={setDuration}
          minimumTrackTintColor={Theme.Colors.primary}
          maximumTrackTintColor={Theme.Colors.border}
          thumbTintColor={Theme.Colors.surface}
        />
        <Text style={Theme.Colors.primary}>{duration} minutes</Text>
      </View>

      <Text style={styles.label}>Background Music</Text>
      <ScrollView horizontal style={{ marginVertical: 12 }}>
        <View style={styles.soundItem}>
          <Image source={require('@/assets/forest.jpeg')} style={styles.soundImage} />
          <Text>Forest</Text>
        </View>
        {/* 你可以放更多背景圖 */}
      </ScrollView>

      <TouchableOpacity
        style={[styles.startButton, isPlaying && styles.stopButton]}
        onPress={isPlaying ? stopMeditation : startMeditation}
      >
        <Text style={styles.startButtonText}>
          {isPlaying ? 'End Meditation' : 'Start Meditation'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Theme.Spacing.xl,
    flex: 1,
    backgroundColor: Theme.Colors.background,
  },
  label: {
    fontSize: Theme.Fonts.sizes.lg,
    fontWeight: Theme.Fonts.weights.bold,
    color: Theme.Colors.textPrimary,
    marginTop: Theme.Spacing.lg,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.Spacing.md,
  },
  durationText: {
    marginLeft: Theme.Spacing.sm,
    fontSize: Theme.Fonts.sizes.md,
    color: Theme.Colors.accent, // 可以換成 textSecondary 依你喜好
  },

  soundItem: {
    alignItems: 'center',
    marginRight: Theme.Spacing.lg,
  },
  soundImage: {
    width: 64,
    height: 64,
    borderRadius: Theme.BorderRadius.circle,
    marginBottom: Theme.Spacing.xs,
  },

  startButton: {
    marginTop: Theme.Spacing.xxl,
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.lg,
    borderRadius: Theme.BorderRadius.lg,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: Theme.Colors.error,
  },
  startButtonText: {
    color: Theme.Colors.surface,
    fontSize: Theme.Fonts.sizes.lg,
    fontWeight: Theme.Fonts.weights.bold,
  },
});
