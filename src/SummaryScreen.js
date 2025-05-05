import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function SummaryScreen({ navigation }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${apiUrl}/questionnaire/summary`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSummary(data.summary || '目前沒有建議內容');
    } catch (error) {
      Alert.alert('錯誤', '無法取得建議內容');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }], 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>你的個人化推薦</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.summaryText}>{summary}</Text>
          <TouchableOpacity style={styles.button} onPress={handleBackToHome}>
            <Text style={styles.buttonText}>回首頁</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  summaryText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
    lineHeight: 28,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});
