import { useState } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Emotion_Categories = {
  Positive: {
    emoji: "😆",
    category: "Positive",
    label: "Positive",
    image: require('../assets/emoji_1.png'),
    emotions: [
      { text: "感激的", emoji: "🙏" },
      { text: "滿足的", emoji: "😊" },
      { text: "有創意的", emoji: "🎨" },
      { text: "有勇氣的", emoji: "🦁" },
      { text: "熱情的", emoji: "🔥" },
      { text: "興奮的", emoji: "🥳" },
      { text: "激動的", emoji: "🤩" },
      { text: "充實的", emoji: "📚" },
      { text: "開心的", emoji: "😄" },
      { text: "感恩的", emoji: "😌" },
      { text: "快樂的", emoji: "😀" },
      { text: "充滿希望的", emoji: "🌈" },
      { text: "喜悅的", emoji: "😁" },
      { text: "自豪的", emoji: "😌" },
      { text: "滿意的", emoji: "😎" },
      { text: "堅強的", emoji: "💪" },
      { text: "感謝的", emoji: "🫶" }
    ],
    image: require('../assets/emoji_1.png'),
    emotions: ["感激的", "滿足的", "有創意的", "有勇氣的", "熱情的", "興奮的", "激動的", "充實的", "開心的", "感恩的", "快樂的", "充滿希望的", "喜悅的", "自豪的", "滿意的", "堅強的", "感謝的"]
  },
  Good: {
    emoji: "😌",
    category: "Good",
    label: "Good",
    image: require('../assets/emoji_2.png'),
    emotions: [
      { text: "自在的", emoji: "😌" },
      { text: "頭腦清晰的", emoji: "🧠" },
      { text: "鎮定的", emoji: "🧘" },
      { text: "舒適的", emoji: "🛋️" },
      { text: "踏實的", emoji: "🧱" },
      { text: "專注當下的", emoji: "🎯" },
      { text: "平靜的", emoji: "🌊" },
      { text: "活在當下的", emoji: "🕰️" },
      { text: "神清氣爽的", emoji: "🌤️" },
      { text: "放鬆的", emoji: "🛀" },
      { text: "充分休息的", emoji: "😴" },
      { text: "有安全感的", emoji: "🛡️" },
      { text: "寧靜的", emoji: "🍃" },
      { text: "無憂無慮的", emoji: "🎈" }
    ],
    image: require('../assets/emoji_2.png'),
    emotions: ["自在的", "頭腦清晰的", "鎮定的", "舒適的", "踏實的", "專注當下的", "平靜的", "活在當下的", "神清氣爽的", "放鬆的", "充分休息的", "有安全感的", "寧靜的", "無憂無慮的"]
  },
  Neutral: {
    emoji: "😶",
    category: "Neutral",
    label: "Neutral",
    image: require('../assets/emoji_3.png'),
    emotions: [
      { text: "害怕的", emoji: "😨" },
      { text: "焦慮的", emoji: "😟" },
      { text: "冷漠的", emoji: "😐" },
      { text: "無感的", emoji: "😑" },
      { text: "憂慮的", emoji: "😥" },
      { text: "擔憂的", emoji: "🤔" },
      { text: "無聊的", emoji: "🥱" },
      { text: "慌張的", emoji: "😰" },
      { text: "擔心的", emoji: "😧" },
      { text: "矛盾的", emoji: "🤷‍♀️" },
      { text: "困惑的", emoji: "😕" },
      { text: "疏離的", emoji: "🚶" },
      { text: "分心的", emoji: "🙃" },
      { text: "漠不關心的", emoji: "🫥" },
      { text: "失眠的", emoji: "🌙" },
      { text: "懶散的", emoji: "🛌" },
      { text: "混亂的", emoji: "🌪️" },
      { text: "心情複雜的", emoji: "🌀" },
      { text: "緊張的", emoji: "😬" },
      { text: "驚慌的", emoji: "😱" },
      { text: "思緒紊亂的", emoji: "💭" },
      { text: "壓力大的", emoji: "🥵" },
      { text: "懷疑的", emoji: "🧐" },
      { text: "左右為難的", emoji: "🤹" }
    ],
    image: require('../assets/emoji_3.png'),
    emotions: ["害怕的", "焦慮的", "冷漠的", "無感的", "憂慮的", "擔憂的", "無聊的", "慌張的", "擔心的", "矛盾的", "困惑的", "疏離的", "分心的", "漠不關心的", "失眠的", "懶散的", "混亂的", "心情複雜的", "緊張的", "驚慌的", "思緒紊亂的", "壓力大的", "懷疑的", "左右為難的"]
  },
  Negative: {
    emoji: "😢",
    category: "Negative",
    label: "Negative",
    image: require('../assets/emoji_4.png'),
    emotions: [
      { text: "焦躁不安的", emoji: "😖" },
      { text: "憂慮的", emoji: "😔" },
      { text: "苦惱的", emoji: "😣" },
      { text: "坐立不安的", emoji: "🪑❌" },
      { text: "手足無措的", emoji: "🙈" },
      { text: "缺乏安全感的", emoji: "😟🛡️" },
      { text: "不堪重負的", emoji: "😩" },
      { text: "驚慌失措的", emoji: "😱" },
      { text: "疑神疑鬼的", emoji: "👀" },
      { text: "心事重重的", emoji: "💭💭" },
      { text: "心神不寧的", emoji: "🌀" },
      { text: "顫抖的", emoji: "🥶" },
      { text: "不穩定的", emoji: "🌫️" },
      { text: "神經緊繃的", emoji: "🧠⚡" },
      { text: "不確定的", emoji: "❓" },
      { text: "不安的", emoji: "😬" },
      { text: "擔心的", emoji: "😟" }
    ],
    image: require('../assets/emoji_4.png'),
    emotions: ["焦躁不安的", "憂慮的", "苦惱的", "坐立不安的", "手足無措的", "缺乏安全感的", "不堪重負的", "驚慌失措的", "疑神疑鬼的", "心事重重的", "心神不寧的", "顫抖的", "不穩定的", "神經緊繃的", "不確定的", "不安的", "擔心的"]
  },
  Sad: {
    emoji: "😭",
    category: "Sad",
    label: "Saaad",
    image: require('../assets/emoji_5.png'),
    emotions: [
      { text: "生氣的", emoji: "😡" },
      { text: "傲慢的", emoji: "😤" },
      { text: "好勝的", emoji: "🥇" },
      { text: "競爭心強的", emoji: "🏁" },
      { text: "厭惡的", emoji: "🤢" },
      { text: "反感的", emoji: "😒" },
      { text: "挫折的", emoji: "😞" },
      { text: "受挫的", emoji: "😤" },
      { text: "充滿厭惡感的", emoji: "🤮" },
      { text: "不耐煩的", emoji: "😠" },
      { text: "嫉妒的", emoji: "😒💚" },
      { text: "悲觀的", emoji: "🌧️" },
      { text: "自我批評的", emoji: "😓" },
      { text: "惱怒的", emoji: "😾" },
      { text: "被打擾的", emoji: "😣" },
      { text: "思想封閉的", emoji: "🧱" },
      { text: "固執的", emoji: "🐂" },
      { text: "防備心重的", emoji: "🛡️" },
      { text: "羨慕的", emoji: "👀✨" },
      { text: "忌妒的", emoji: "🧿" },
      { text: "充滿蔑視的", emoji: "😏" },
      { text: "脾氣暴躁的", emoji: "😤" },
      { text: "煩躁的", emoji: "😫" },
      { text: "惱火的", emoji: "🔥" },
      { text: "愛批判人的", emoji: "🧐🗣️" },
      { text: "憤恨的", emoji: "😠" },
      { text: "記恨的", emoji: "🧾" }
    ],
    image: require('../assets/emoji_5.png'),
    emotions: ["生氣的", "傲慢的", "好勝的", "競爭心強的", "厭惡的", "反感的", "挫折的", "受挫的", "充滿厭惡感的", "不耐煩的", "嫉妒的", "悲觀的", "自我批評的", "惱怒的", "被打擾的", "思想封閉的", "固執的", "防備心重的", "羨慕的", "忌妒的", "充滿蔑視的", "脾氣暴躁的", "煩躁的", "惱火的", "愛批判人的", "憤恨的", "記恨的"]
  }
};

export default function SelectEmoji() {
  const [selectedCategory, setSelectedCategory] = useState("Positive");
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const navigation = useNavigation();

  const toggleEmotion = (emotion, emoji) => {
    const isSelected = selectedEmotions.find((e) => e.emotion === emotion);
    if (isSelected) {
      setSelectedEmotions(selectedEmotions.filter((e) => e.emotion !== emotion));
    } else {
      if (selectedEmotions.length < 5) {
        setSelectedEmotions([...selectedEmotions, { emotion, emoji, category: selectedCategory }]);
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
<View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
  {[...Array(5)].map((_, index) => {
    const emotion = selectedEmotions[index];
    return (
      <View
        key={index}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: '#aaa',
          marginHorizontal: 4,
          backgroundColor: emotion ? '#ffd' : '#fff',
        }}
      >
        <Text style={{ fontSize: 20 }}>{emotion?.emoji || ''}</Text>
      </View>
    );
  })}
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
  keyExtractor={(item) => item.text}
  numColumns={3}
  columnWrapperStyle={{ justifyContent: 'space-between' }}
  contentContainerStyle={{ paddingBottom: 40 }}
  style={{ marginTop: 10 }}
  renderItem={({ item }) => {
    const isSelected = selectedEmotions.some((e) => e.emotion === item.text);
    return (
      <TouchableOpacity
        style={[
          {
            flex: 1,
            margin: 6,
            paddingVertical: 10,
            paddingHorizontal: 12,
            backgroundColor: isSelected ? '#ffefc5' : '#f2f2f2',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: isSelected ? '#f0a500' : '#ccc',
            alignItems: 'center'
          }
        ]}
        onPress={() => toggleEmotion(item.text, item.emoji)}
      >
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
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
