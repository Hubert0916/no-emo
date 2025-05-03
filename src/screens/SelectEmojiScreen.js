import { useState } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Emotion_Categories = {
  Positive: {
    emoji: "😆",
    category: "Positive",
    label: "Positive",
    image: require('../..//assets/emoji_1.png'),
    emotions: ["感激的", "滿足的", "有創意的", "有勇氣的", "熱情的", "興奮的", "激動的", "充實的", "開心的", "感恩的", "快樂的", "充滿希望的", "喜悅的", "自豪的", "滿意的", "堅強的", "感謝的"]
  },
  Good: {
    emoji: "😌",
    category: "Good",
    label: "Good",
    image: require('../../assets/emoji_2.png'),
    emotions: ["自在的", "頭腦清晰的", "鎮定的", "舒適的", "踏實的", "專注當下的", "平靜的", "活在當下的", "神清氣爽的", "放鬆的", "充分休息的", "有安全感的", "寧靜的", "無憂無慮的"]
  },
  Neutral: {
    emoji: "😶",
    category: "Neutral",
    label: "Neutral",
    image: require('../../assets/emoji_3.png'),
    emotions: ["害怕的", "焦慮的", "冷漠的", "無感的", "憂慮的", "擔憂的", "無聊的", "慌張的", "擔心的", "矛盾的", "困惑的", "疏離的", "分心的", "漠不關心的", "失眠的", "懶散的", "混亂的", "心情複雜的", "緊張的", "驚慌的", "思緒紊亂的", "壓力大的", "懷疑的", "左右為難的"]
  },
  Negative: {
    emoji: "😢",
    category: "Negative",
    label: "Negative",
    image: require('../../assets/emoji_4.png'),
    emotions: ["焦躁不安的", "憂慮的", "苦惱的", "坐立不安的", "手足無措的", "缺乏安全感的", "不堪重負的", "驚慌失措的", "疑神疑鬼的", "心事重重的", "心神不寧的", "顫抖的", "不穩定的", "神經緊繃的", "不確定的", "不安的", "擔心的"]
  },
  Sad: {
    emoji: "😭",
    category: "Sad",
    label: "Saaad",
    image: require('../../assets/emoji_5.png'),
    emotions: ["生氣的", "傲慢的", "好勝的", "競爭心強的", "厭惡的", "反感的", "挫折的", "受挫的", "充滿厭惡感的", "不耐煩的", "嫉妒的", "悲觀的", "自我批評的", "惱怒的", "被打擾的", "思想封閉的", "固執的", "防備心重的", "羨慕的", "忌妒的", "充滿蔑視的", "脾氣暴躁的", "煩躁的", "惱火的", "愛批判人的", "憤恨的", "記恨的"]
  }
};

export default function SelectEmoji() {
  const [selectedCategory, setSelectedCategory] = useState("Positive");
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const navigation = useNavigation();

  const toggleEmotion = (emotion) => {
    const isSelected = selectedEmotions.find((e) => e.emotion === emotion);
    if (isSelected) {
      setSelectedEmotions(selectedEmotions.filter((e) => e.emotion !== emotion));
    } else {
      if (selectedEmotions.length < 5) {
        setSelectedEmotions([...selectedEmotions, { emotion, category: selectedCategory }]);
      } else {
        alert("最多只能選五個ㄡ！");
      }
    }
  };

  const goToViewScreen = () => {
    if (selectedEmotions.length < 1) {
      alert("請至少選擇一個情緒！");
      return;
    }
    navigation.navigate('Review', { selectedEmotions });
  };

  const currentCategory = Emotion_Categories[selectedCategory];
  const currentEmotions = currentCategory.emotions || [];

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', width: 200, justifyContent: 'space-between' }}>
          {[...Array(5)].map((_, index) => {
            const category = selectedEmotions[index]?.category;
            const emoji = Emotion_Categories[category]?.emoji;
            return (
              <View
                key={index}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 16,
                  borderWidth: 1,
                  paddingLeft: 1.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#aaa',
                  backgroundColor: emoji ? '#ffd' : '#fff',
                }}
              >
                <Text style={{ fontSize: 20 }}>{emoji || ''}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        {Object.keys(Emotion_Categories).map((categoryKey) => {
          const categoryData = Emotion_Categories[categoryKey];
          return (
            <TouchableOpacity
              key={categoryKey}
              style={[
                {
                  flex: 1,
                  marginHorizontal: 4,
                  paddingVertical: 8,
                  backgroundColor: '#ccc',
                  borderRadius: 4,
                  alignItems: 'center'
                },
                categoryKey === selectedCategory && { backgroundColor: '#ffa' }
              ]}
              onPress={() => setSelectedCategory(categoryKey)}
            >
              <Image source={categoryData.image} style={{ width: 40, height: 40 }} resizeMode="contain" />
              <Text style={{ fontSize: 12, marginTop: 4 }}>{categoryData.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={currentEmotions}
        keyExtractor={(item) => item}
        style={{ marginTop: 10 }}
        renderItem={({ item }) => {
          const isSelected = selectedEmotions.some((e) => e.emotion === item);
          return (
            <TouchableOpacity
              style={[
                {
                  padding: 12,
                  marginVertical: 4,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 4
                },
                isSelected && { backgroundColor: '#ffefc5' }
              ]}
              onPress={() => toggleEmotion(item)}
            >
              <Text style={{ fontSize: 16 }}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="下一步" onPress={goToViewScreen} />
      </View>
    </SafeAreaView>
  );
}
