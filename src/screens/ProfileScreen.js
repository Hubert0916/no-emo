import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { register, login } from '@/lib/api/authRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';


export default function AuthScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAuthAction = async () => {
    if (!emailPattern.test(email)) {
      Alert.alert('錯誤', 'Email格式不符合!');
      return;
    }

    if (isRegister) {
      if (password !== confirmPassword) {
        Alert.alert('錯誤', '密碼不一致');
        return;
      }
      if (password.length < 6) {
        Alert.alert('錯誤', '密碼至少要 6 碼!');
        return;
      }

      try {
        const res = await register({ email, name, password });

        if (res.status === 201) {
          Alert.alert('註冊成功', '請使用新帳號登入');
          setIsRegister(false);
          setName(''); setPassword(''); setConfirmPassword('');
        }
        else if (res.status === 500) {
          Alert.alert('註冊失敗', 'Email已存在!');
        }
        else {
          const err = await res.json();
          console.log(err);
          Alert.alert('註冊失敗', err.message || '請重試');
        }
      } catch (error) {
        Alert.alert('錯誤', error.message);
      }

    } else {
      try {
        const res = await login();
        const result = await res.json();
        console.log(result); // 看有沒有 response 回來
        Alert.alert('成功', 'HTTPS 請求成功');
        // const res = await login({ email, password });

        // if (res.status === 200) {
        //   const { token } = await res.json();
        //   await AsyncStorage.setItem('token', token);
        //   Alert.alert('登入成功', '歡迎!');
        //   const userProfile = await AsyncStorage.getItem('user_profile');
        //   if (userProfile) {
        //     navigation.replace('UserProfile');
        //   } else {
        //     navigation.replace('ProfileSetup');
        //   }
        // }
        // else if (res.status === 401) {
        //   Alert.alert('登入失敗', '帳號或密碼錯誤');
        // }
        // else {
        //   const data = await res.json();
        //   Alert.alert('錯誤', data.message || '請重試');
        // }
      } catch (error) {
        Alert.alert('錯誤', error.message);
      }
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F0F8FF'
    }}>
      <View style={{
        width: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
      }}>
        <Text style={{
          fontSize: 28,
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: 20,
          color: '#616161'
        }}>
          {isRegister ? '註冊新帳號 ✌️' : '歡迎回來 😄'}
        </Text>

        {isRegister && (
          <TextInput
            style={inputStyle}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            placeholder="名稱"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
        )}

        <TextInput
          style={inputStyle}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          placeholder="電子郵件"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* 密碼輸入框 + 顯示/隱藏按鈕 */}
        <View style={{ position: 'relative', marginBottom: 15 }}>
          <TextInput
            style={{ ...inputStyle, paddingRight: 45 }}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            placeholder="密碼"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 15, top: 12 }}
          >
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* 確認密碼（註冊時） */}
        {isRegister && (
          <View style={{ position: 'relative', marginBottom: 15 }}>
            <TextInput
              style={{ ...inputStyle, paddingRight: 45 }}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              placeholder="確認密碼"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: 'absolute', right: 15, top: 12 }}
            >
              <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: '#4CAF50',
            height: 50,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10
          }}
          onPress={handleAuthAction}
        >
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#fff'
          }}>
            {isRegister ? '註冊' : '登入'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 12, alignItems: 'center' }}
          onPress={() => setIsRegister(!isRegister)}
        >
          <Text style={{
            fontSize: 16,
            color: '#A8E6CF',
            textDecorationLine: 'underline'
          }}>
            {isRegister ? '已有帳號？登入' : '還沒有帳號？註冊'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const inputStyle = {
  height: 50,
  borderColor: '#CCE8CF',
  borderWidth: 1,
  borderRadius: 15,
  marginBottom: 15,
  paddingHorizontal: 15,
  backgroundColor: '#FFF',
  fontSize: 16,
};