import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 
import { getUserProfile } from '@/lib/api/profileRequest'; 


export default function UserProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Load from local cache first
        const cachedProfile = await AsyncStorage.getItem('userProfile');
        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile));
        }
        
        // Then fetch latest data from backend
        const remote = await getUserProfile();
        if (remote) {
          setProfile(remote);
          // Update local cache
          try {
            await AsyncStorage.setItem('userProfile', JSON.stringify(remote));
          } catch (e) {
            console.error('快取更新失敗', e);
          }
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

return (
    <View style={styles.container}>
      {profile.photo && (
        <Image source={{ uri: profile.photo }} style={styles.avatar} />
      )}
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.bio}>{profile.bio}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>登出</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: "#EEE",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 20,
    color: '#555',
  },
  logoutButton: {
  marginTop: 30,
  backgroundColor: '#EF5350',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});
