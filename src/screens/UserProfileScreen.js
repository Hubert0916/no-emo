import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 


export default function UserProfileScreen() {
  const [profile, setProfile] = useState(null);
  const navigation = useNavigation(); 

  useEffect(() => {
    const loadProfile = async () => {
      const data = await AsyncStorage.getItem("user_profile");
      if (data) {
        setProfile(JSON.parse(data));
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'user_profile']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };


  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>載入中...</Text>
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
  text: {
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
