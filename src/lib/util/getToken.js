import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getToken() {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (err) {
    console.error('failed to get token from local:', err);
    return null;
  }
}