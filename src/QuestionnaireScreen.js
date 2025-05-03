import React, { useEffect, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://140.113.26.107:5000/apidocs/#'; // 替換為你的實際 API 網址

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
      const res = await fetch(`${API_URL}/questionnaire/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setQuestion(data.question);
    } catch (error) {
      Alert.alert('錯誤', '無法啟動問卷');
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
      const updatedQaList = [...qaList, { question, answer }];
      setQaList(updatedQaList);

      const res = await fetch(`${API_URL}/questionnaire/next`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
      });

      const data = await res.json();
      if (data.question) {
        setQuestion(data.question);
        setAnswer('');
      } else {
        navigation.navigate('SummaryScreen');
      }
    } catch (error) {
      Alert.alert('錯誤', '無法取得下一題');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          />
          <TouchableOpacity style={styles.button} onPress={submitAnswer}>
            <Text style={styles.buttonText}>送出</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
