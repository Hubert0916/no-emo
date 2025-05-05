import React, { useEffect, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function QuestionnaireScreen({ navigation }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startQuestionnaire();
  }, []);

  const startQuestionnaire = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);
  
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      };
      const response = await fetch(`${apiUrl}/questionnaire/start`, requestOptions);
  
      if (!response.ok) {
        throw new Error('無法啟動問卷');
      }
  
      const data = await response.json();
      const cleanQuestion = data.question.split('<|/im_start|>')[0].trim();
      setQuestion(cleanQuestion);
  
    } catch (error) {
      console.error('問卷啟動失敗:', error);
      Alert.alert('錯誤', '無法啟動問卷，請稍後再試');
    } finally {
      setLoading(false);
    }
  };
  
  const submitAnswer = async () => {
    if (!answer.trim()) {
      Alert.alert('提醒', '請先輸入回答');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
  
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);
  
      const raw = JSON.stringify({ answer });
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
  
      const response = await fetch(`${apiUrl}/questionnaire/next`, requestOptions);
  
      if (!response.ok) {
        throw new Error('問卷送出失敗');
      }
  
      const data = await response.json();
  
      if (data.question) {
        const cleanQuestion = data.question.split('<|/im_start|>')[0].trim();
        setQaList(prev => [...prev, { question, answer }]);
        setQuestion(cleanQuestion);
        setAnswer('');
      } else {
        // 問卷結束
        await fetch(`${apiUrl}/set_is_filled`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        navigation.navigate('Check-In');
      }
  
    } catch (error) {
      console.error('送出失敗:', error);
      Alert.alert('錯誤', '無法取得下一題');
    } finally {
      setLoading(false);
    }
  };
  

return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#E3F2FD' }}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <>
            <Text style={styles.question}>{question}</Text>
            <TextInput
              style={styles.input}
              placeholder="請輸入你的回答..."
              value={answer}
              onChangeText={setAnswer}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={submitAnswer}>
              <Text style={styles.buttonText}>送出</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  </SafeAreaView>
);
}


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },  
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#90CAF9',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});
