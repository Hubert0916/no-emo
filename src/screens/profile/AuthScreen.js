import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "@react-native-vector-icons/feather";

import { register, login } from "@/lib/api/authRequest";
import { useAuth } from "@/contexts/AuthContext";
import { isUserProfileFilled } from "@/lib/api/profileRequest";
import Theme from "@/lib/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.Colors.background,
  },
  card: {
    width: "80%",
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.xl,
    padding: Theme.Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: Theme.Fonts.sizes.xxl,
    fontWeight: Theme.Fonts.weights.semibold,
    textAlign: "center",
    marginBottom: Theme.Spacing.lg,
    color: Theme.Colors.textSecondary,
  },
  input: {
    height: 50,
    borderColor: Theme.Colors.border,
    borderWidth: 1,
    borderRadius: Theme.BorderRadius.lg,
    marginBottom: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surface,
    fontSize: Theme.Fonts.sizes.md,
    color: Theme.Colors.textPrimary,
  },
  inputWithIcon: {
    height: 50,
    borderColor: Theme.Colors.border,
    borderWidth: 1,
    borderRadius: Theme.BorderRadius.lg,
    marginBottom: 4,
    paddingHorizontal: Theme.Spacing.md,
    paddingRight: 45,
    backgroundColor: Theme.Colors.surface,
    fontSize: Theme.Fonts.sizes.md,
    color: Theme.Colors.textPrimary,
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
    fontSize: Theme.Fonts.sizes.xs,
    color: Theme.Colors.placeholder,
    marginBottom: 8,
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: Theme.Colors.primary,
    height: 50,
    borderRadius: Theme.BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Theme.Spacing.md,
  },
  submitButtonText: {
    fontSize: Theme.Fonts.sizes.lg,
    fontWeight: Theme.Fonts.weights.semibold,
    color: Theme.Colors.surface,
  },
  switchButton: {
    marginTop: Theme.Spacing.md,
    alignItems: "center",
  },
  switchButtonText: {
    fontSize: Theme.Fonts.sizes.md,
    color: Theme.Colors.primary,
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
        await authLogin(token); // 儲存 token

        Alert.alert("登入成功", "歡迎!");

        // ✅ 改用後端 check_is_filled API 判斷是否已填寫個人資料
        try {
          const filledResult = await isUserProfileFilled();

          if (filledResult?.is_filled) {
            navigation.replace("UserProfile");
          } else {
            navigation.replace("ProfileSetup");
          }
        } catch (error) {
          console.error("❌ 檢查 is_filled 發生錯誤:", error);
          Alert.alert("錯誤", "無法確認使用者狀態，導向設定頁");
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