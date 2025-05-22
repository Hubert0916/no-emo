import { useState, useEffect } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProfileSetupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState(null);
  const activityTagMap = {
  '感官享受': 'food',
  '自我反思': 'meditation',
  '生活整理': 'cleanUpRoom',
  '情境轉換': 'watchMovie',
  '情緒療癒': 'musicRecommendation',
  '身體活動': 'goForAWalk',
};
  const activityTags = Object.entries(activityTagMap); // 產生 [['感官享受', 'food'], ...]
  const [selectedTags, setSelectedTags] = useState([]);


  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('權限錯誤', '請開啟相簿權限來上傳照片');
      }
    })();
  }, []);

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

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert('請輸入姓名');
      return;
    }
  
    const userProfile = {
      name,
      bio,
      photo,
      preferredActivities: selectedTags,
    };
  
    await AsyncStorage.setItem('user_profile', JSON.stringify(userProfile));
  
    navigation.replace('UserProfile');
  };
  
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>完善你的個人資料</Text>

      <TouchableOpacity onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={{ color: '#999' }}>點擊上傳大頭貼</Text>
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
        style={[styles.input, { height: 100 }]}
        placeholder="簡單自我介紹..."
        multiline
        value={bio}
        onChangeText={setBio}
      />

       <View style={{ width: '100%', marginTop: 20 }}>
        <Text style={styles.questionTitle}>你心情不好的時候會喜歡做哪些類別的活動？</Text>
        <Text style={{ color: '#666', marginBottom: 10 }}>可以幫助小天使幫你找適合的活動喔！（可複選）</Text>
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
    </ScrollView>
  </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#F2F2F2', // 更中性的淺灰色背景
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#455A64', 
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DADADA', // 淺粉色邊框
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  placeholderImage: {
   width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EBEBEB', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#455A64', 
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
    color: '#455A64', // 溫暖的褐色文字
  },
  tagSelected: {
    backgroundColor: '#E0E6ED', // 柔和的粉橙色背景
    borderColor: '#7895B2', // 更深的粉橙色邊框
  },
  button: {
    backgroundColor: '#7895B2', // 柔和的粉橙色按鈕
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});