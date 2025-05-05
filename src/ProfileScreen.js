import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode"
import { useNavigation } from '@react-navigation/native';


const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function AuthScreen() {
  const navigation = useNavigation();
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
        const res = await fetch(`${apiUrl}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, password }),
        });
        if (res.status === 201) {
          Alert.alert('註冊成功', '請驗證後使用新帳號登入');
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
        const res = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
    
        if (res.status === 200) {
          const { token } = await res.json();
          const payload = jwtDecode(token);
          await AsyncStorage.setItem('token', token);
    
          // 檢查是否已填寫問卷
          const checkRes = await fetch(`${apiUrl}/check_is_filled`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
    
          const checkData = await checkRes.json();
    
          if (checkData.is_filled) {
            navigation.navigate('Check-In'); 
          } else {
            navigation.navigate('QuestionnaireScreen'); 
          }
    
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