import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/lib/api/profileRequest";

// Activity type mapping
const ACTIVITY_TYPES = {
  food: 'Enjoy Food',
  meditation: 'Meditation', 
  cleanUpRoom: 'Clean Room',
  watchMovie: 'Watch Movie',
  musicRecommendation: 'Listen to Music',
  goForAWalk: 'Take a Walk'
};

const ACTIVITY_TAG_MAP = {
  '感官享受': 'food',
  '自我反思': 'meditation',
  '生活整理': 'cleanUpRoom',
  '情境轉換': 'watchMovie',
  '情緒療癒': 'musicRecommendation',
  '身體活動': 'goForAWalk',
};

export default function ProfileSetupScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const activityTags = Object.entries(ACTIVITY_TAG_MAP);

  useEffect(() => {
    requestImagePermission();
  }, []);

  const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("權限錯誤", "請開啟相簿權限來上傳照片");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const toggleTag = (tagValue) => {
    if (selectedTags.includes(tagValue)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagValue));
    } else {
      setSelectedTags([...selectedTags, tagValue]);
    }
  };

  const setUserIsFilled = async () => {
    try {
      await AsyncStorage.setItem('user_profile_filled', 'true');
      return true;
    } catch (error) {
      console.error('設定填寫狀態失敗:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("請輸入姓名");
      return;
    }

    const userProfile = {
      name: name.trim(),
      bio: bio.trim(),
      profile: photo,
      preferredActivities: selectedTags,
    };

    const filled = await setUserIsFilled();
    if (!filled) {
      Alert.alert('錯誤', '設定填寫狀態失敗');
      return;
    }

    await AsyncStorage.setItem("user_profile", JSON.stringify(userProfile));
    navigation.replace("UserProfile");
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace("Auth");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>完善你的個人資料</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>點擊上傳大頭貼</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="你的名字"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="簡單自我介紹..."
          multiline
          value={bio}
          onChangeText={setBio}
        />

        <View style={styles.tagSection}>
          <Text style={styles.questionTitle}>
            你心情不好的時候會喜歡做哪些類別的活動？
          </Text>
          <Text style={styles.questionSubtitle}>
            可以幫助小天使幫你找適合的活動喔！（可複選）
          </Text>
          
          {activityTags.map(([tagName, tagValue]) => (
            <TouchableOpacity
              key={tagValue}
              onPress={() => toggleTag(tagValue)}
              style={[
                styles.tagOption,
                selectedTags.includes(tagValue) && styles.tagSelected,
              ]}
            >
              <Text style={styles.tagText}>{tagName}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>完成設定</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>登出</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  scrollContainer: {
    padding: 30,
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: '#455A64',
  },
  imagePickerContainer: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DADADA',
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: "#999",
    textAlign: 'center',
  },
  tagSection: {
    width: '100%',
    marginTop: 20,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#455A64',
  },
  questionSubtitle: {
    color: '#666',
    marginBottom: 10,
  },
  tagOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  tagText: {
    fontSize: 16,
    color: '#455A64',
  },
  tagSelected: {
    backgroundColor: '#E0E6ED',
    borderColor: '#7895B2',
  },
  button: {
    backgroundColor: '#7895B2',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#EF5350',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
