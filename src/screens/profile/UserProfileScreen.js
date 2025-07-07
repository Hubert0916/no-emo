import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getUserProfile } from '@/lib/api/profileRequest';
import Theme from '@/lib/theme';


const DEFAULT_NAME = '個人資料';
const DEFAULT_BIO = '這個人還沒有留下自我介紹。';
const DEFAULT_ACTIVITY = ['尚未填寫活動偏好'];

export default function UserProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const cachedProfile = await AsyncStorage.getItem('userProfile');
        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile));
        }

        const remote = await getUserProfile();
        if (remote) {
          setProfile(remote);
          await AsyncStorage.setItem('userProfile', JSON.stringify(remote));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'userProfile']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  if (loading || !profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>載入中...</Text>
      </View>
    );
  }

  const displayName = profile.name || DEFAULT_NAME;
  const displayBio = profile.bio || DEFAULT_BIO;
  const displayActivity = profile.activity?.length > 0 ? profile.activity : DEFAULT_ACTIVITY;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.name}>{displayName}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>自我介紹</Text>
          <Text style={styles.sectionContent}>{displayBio}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>喜歡的活動</Text>
          <View style={styles.activityWrap}>
            {displayActivity.map((item, index) => (
              <Text key={index} style={styles.activityItem}>• {item}</Text>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>登出</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  container: {
    alignItems: 'center',
    backgroundColor: Theme.Colors.background,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: Theme.Colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    width: "100%",
    backgroundColor: Theme.Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: Theme.Colors.textPrimary,
  },
  sectionContent: {
    fontSize: 16,
    color: Theme.Colors.textSecondary,
  },
  activityWrap: {
    marginTop: 6,
  },
  activityItem: {
    fontSize: 15,
    color: Theme.Colors.textSecondary,
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: Theme.Colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  logoutText: {
    color: Theme.Colors.onDanger,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 18,
    color: Theme.Colors.textSecondary,
  },
});
