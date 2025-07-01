import { useState } from "react";
import {
  View,
  TextInput,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/lib/api/profileRequest";

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
  const [selectedTags, setSelectedTags] = useState([]);

  const activityTags = Object.entries(ACTIVITY_TAG_MAP);

  const toggleTag = (tagValue) => {
    if (selectedTags.includes(tagValue)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagValue));
    } else {
      setSelectedTags([...selectedTags, tagValue]);
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
      activity: selectedTags,
    };

    try {
      const result = await updateUserProfile(userProfile);
      if (!result || result.error) throw new Error("後端儲存失敗");

      // ✅ 通知後端設定 is_filled = true
      const filledResult = await setUserIsFilled();
      if (!filledResult || filledResult.error) {
        throw new Error("設定 is_filled 失敗");
      }

      navigation.replace("UserProfile");
    } catch (err) {
      console.error("❌ 更新使用者失敗", err);
      Alert.alert("錯誤", "無法儲存使用者資料，請稍後再試");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace("Auth");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>完善你的個人資料</Text>

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

          {activityTags.map(([label, value]) => (
            <TouchableOpacity
              key={value}
              onPress={() => toggleTag(value)}
              style={[
                styles.tagOption,
                selectedTags.includes(value) && styles.tagSelected,
              ]}
            >
              <Text style={styles.tagText}>{label}</Text>
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
