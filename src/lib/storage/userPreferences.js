import AsyncStorage from '@react-native-async-storage/async-storage';

// Default weights for all activities
const DEFAULT_WEIGHTS = {
  food: 1,
  meditation: 1,
  cleanUpRoom: 1,
  watchMovie: 1,
  musicRecommendation: 1,
  goForAWalk: 1,
};

// Get user's activity preference weights
export const getRecommendationWeights = async () => {
  try {
    const storedWeights = await AsyncStorage.getItem('userActivityWeights');
    if (storedWeights) {
      const parsedWeights = JSON.parse(storedWeights);
      // Merge with defaults to ensure all activities have weights
      return { ...DEFAULT_WEIGHTS, ...parsedWeights };
    }
    return DEFAULT_WEIGHTS;
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return DEFAULT_WEIGHTS;
  }
};

// Save user's activity preference weights
export const setRecommendationWeights = async (weights) => {
  try {
    await AsyncStorage.setItem('userActivityWeights', JSON.stringify(weights));
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
};

// Update specific activity weight
export const updateActivityWeight = async (activityId, weight) => {
  try {
    const currentWeights = await getRecommendationWeights();
    const updatedWeights = {
      ...currentWeights,
      [activityId]: weight,
    };
    return await setRecommendationWeights(updatedWeights);
  } catch (error) {
    console.error('Error updating activity weight:', error);
    return false;
  }
};

// Reset to default weights
export const resetRecommendationWeights = async () => {
  try {
    await AsyncStorage.removeItem('userActivityWeights');
    return true;
  } catch (error) {
    console.error('Error resetting user preferences:', error);
    return false;
  }
}; 