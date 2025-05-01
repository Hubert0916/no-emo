import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode"

 // const API_URL = '';

export default function AuthScreen({ navigation }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAction = async () => {
    if (isRegister) {
      if (password !== confirmPassword) {
        Alert.alert('錯誤', '密碼不一致:(');
        return;
      }
      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, password }),
        });
        if (res.status === 201) {
          Alert.alert('註冊成功', '請使用新帳號登入');
          setIsRegister(false);
          setName(''); setPassword(''); setConfirmPassword('');
        } else {
          const data = await res.json();
          Alert.alert('註冊失敗', data.message || '請重試');
        }
      } catch (error) {
        Alert.alert('錯誤', error.message);
      }
    } else {
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (res.status === 200) {
          const { token } = await res.json();
          const payload = jwtDecode(token);
          await AsyncStorage.setItem('token', token);
          Alert.alert('登入成功❤️', '你只會停留在此頁面');
        } else if (res.status === 401) {
          Alert.alert('登入失敗', '帳號或密碼錯誤');
        } else {
          const data = await res.json();
          Alert.alert('錯誤', data.message || '請重試');
        }
      } catch (error) {
        Alert.alert('錯誤', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{isRegister ? '註冊新帳號 ✌️' : '歡迎回來 😄'}</Text>

        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="名稱"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="電子郵件"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="密碼"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="確認密碼"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleAction}>
          <Text style={styles.buttonText}>{isRegister ? '註冊' : '登入'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleButton} onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.toggleText}>
            {isRegister ? '已有帳號？登入' : '還沒有帳號？註冊'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  innerContainer: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#616161',
  },
  input: {
    height: 50,
    borderColor: '#CCE8CF',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  toggleButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    color: '#A8E6CF',
    textDecorationLine: 'underline',
  },
});
