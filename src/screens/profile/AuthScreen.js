import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "@react-native-vector-icons/feather";

import { register, login } from "@/lib/api/authRequest";
import { useAuth } from "@/contexts/AuthContext";

// Style constants
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
  },
  card: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#616161",
  },
  input: {
    height: 50,
    borderColor: "#CCE8CF",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
  inputWithIcon: {
    height: 50,
    borderColor: "#CCE8CF",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 4,
    paddingHorizontal: 15,
    paddingRight: 45,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 12,
  },
  passwordHint: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  switchButton: {
    marginTop: 12,
    alignItems: "center",
  },
  switchButtonText: {
    fontSize: 16,
    color: "#A8E6CF",
    textDecorationLine: "underline",
  },
});

export default function AuthScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigation = useNavigation();
  const { login: authLogin } = useAuth();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAuthAction = async () => {
    if (!emailPattern.test(email)) {
      Alert.alert("註冊失敗", "Email格式不符合!");
      return;
    }

    if (isRegister) {
      await handleRegister();
    } else {
      await handleLogin();
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("註冊失敗", "密碼不一致");
      return;
    }

    try {
      const res = await register({ email, name, password });

      if (res.status === 201) {
        Alert.alert("註冊成功", "請先至信箱認證！");
        setIsRegister(false);
        setName("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const err = await res.json();
        Alert.alert("註冊失敗", err.msg || "請重試");
      }
    } catch (error) {
      Alert.alert("錯誤", error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });

      if (res.status === 200) {
        const { token } = await res.json();
        await authLogin(token);

        Alert.alert("登入成功", "歡迎!");
        // const userProfile = await AsyncStorage.getItem("user_profile");
        // if (userProfile) {
        //   navigation.replace("UserProfile");
        // } else {
        //   navigation.replace("ProfileSetup");
        // }
        
        try {
        const rawProfile = await AsyncStorage.getItem("user_profile");
        const userProfile = rawProfile ? JSON.parse(rawProfile) : null;

        if (userProfile) {
          navigation.replace("ProfileSetup");
        } else {
          navigation.replace("ProfileSetup");
        }
      } catch (error) {
        console.error("❌ 讀取 user_profile 發生錯誤:", error);
        Alert.alert("錯誤", "無法讀取本地用戶資料，已導向設定畫面");
        navigation.replace("ProfileSetup");
      }

      } else if (res.status === 401) {
        Alert.alert("登入失敗", "帳號或密碼錯誤");
      } else {
        const data = await res.json();
        Alert.alert("登入失敗", data.msg || "請重試");
      }
    } catch (error) {
      Alert.alert("錯誤", error.message);
    }
  };

  const renderPasswordInput = (
    value, 
    onChangeText, 
    placeholder, 
    showPassword, 
    setShowPassword, 
    showHint = false
  ) => (
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.inputWithIcon}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        style={styles.eyeIcon}
      >
        <Feather
          name={showPassword ? "eye-off" : "eye"}
          size={20}
          color="#888"
        />
      </TouchableOpacity>
      {showHint && (
        <Text style={styles.passwordHint}>
          密碼需包含大寫、小寫英文字母、特殊符號，且長度不少於 8 位
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {isRegister ? "註冊新帳號 ✌️" : "歡迎回來 😄"}
        </Text>

        {isRegister && (
          <TextInput
            style={styles.input}
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
          style={styles.input}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          placeholder="電子郵件"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {renderPasswordInput(
          password, 
          setPassword, 
          "密碼", 
          showPassword, 
          setShowPassword, 
          isRegister
        )}

        {isRegister && renderPasswordInput(
          confirmPassword, 
          setConfirmPassword, 
          "確認密碼", 
          showConfirmPassword, 
          setShowConfirmPassword
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAuthAction}
        >
          <Text style={styles.submitButtonText}>
            {isRegister ? "註冊" : "登入"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsRegister(!isRegister)}
        >
          <Text style={styles.switchButtonText}>
            {isRegister ? "已有帳號？登入" : "還沒有帳號？註冊"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 