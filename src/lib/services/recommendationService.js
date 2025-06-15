import { getRecommendationWeights } from '@/lib/storage/userPreferences';

// Emotion category to activity mapping
const emotionToActivity = {
  Positive: 'food',               // Eat favorite food
  Good: 'meditation',             // Meditation
  Neutral: 'cleanUpRoom',         // Clean up room
  Sad: 'watchMovie',              // Watch movie as couch potato
  Negative: 'musicRecommendation' // Soothing music recommendation
  // Note: 10-minute walk (goForAWalk) can be used as additional option
};

// Emotion categories
const emotionCategories = {
  Positive: ['Positive'],
  Good: ['Good'],
  Neutral: ['Neutral'],
  Sad: ['Sad'],
  Negative: ['Negative']
};

// Step 1: Calculate activity scores based on emotions
export const getRecommendation = async (emotions) => {
  const activityScores = {};
  
  emotions.forEach(emotion => {
    // Find the category this emotion belongs to
    for (const [category, emotionList] of Object.entries(emotionCategories)) {
      if (emotionList.includes(emotion)) {
        const activityId = emotionToActivity[category];
        if (activityId) {
          // Get corresponding activity ID and accumulate scores
          if (!activityScores[activityId]) {
            activityScores[activityId] = 0;
          }
          activityScores[activityId] += 1;
        }
        break;
      }
    }
  });

  // Step 2: Prioritize activities that match user preferences and have emotional support
  const userWeights = await getRecommendationWeights();
  
  const supportedActivities = Object.keys(activityScores).filter(activityId => 
    userWeights[activityId] > 0 && activityScores[activityId] > 0
  );
  
  if (supportedActivities.length > 0) {
    // Find the highest score among these activities
    let maxScore = 0;
    let bestActivities = [];
    
    supportedActivities.forEach(activityId => {
      const totalScore = activityScores[activityId] + userWeights[activityId];
      if (totalScore > maxScore) {
        maxScore = totalScore;
        bestActivities = [activityId];
      } else if (totalScore === maxScore) {
        bestActivities.push(activityId);
      }
    });
    
    return bestActivities[Math.floor(Math.random() * bestActivities.length)];
  }

  // Step 3: If no matching activities, randomly choose from user preferences
  const preferredActivities = Object.keys(userWeights).filter(activityId => userWeights[activityId] > 0);
  if (preferredActivities.length > 0) {
    return preferredActivities[Math.floor(Math.random() * preferredActivities.length)];
  }

  // Step 4: General recommendation: choose highest scoring activity from all emotion-matching activities
  const emotionSupportedActivities = Object.keys(activityScores);
  if (emotionSupportedActivities.length > 0) {
    let maxScore = 0;
    let bestActivities = [];
    
    emotionSupportedActivities.forEach(activityId => {
      if (activityScores[activityId] > maxScore) {
        maxScore = activityScores[activityId];
        bestActivities = [activityId];
      } else if (activityScores[activityId] === maxScore) {
        bestActivities.push(activityId);
      }
    });
    
    return bestActivities[Math.floor(Math.random() * bestActivities.length)];
  }

  // Step 5: If all conditions fail, return null
  return null;
};