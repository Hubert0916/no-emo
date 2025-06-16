export const categoryOneToOneMap = {
  Positive: 'food',               // 吃點喜歡的食物
  Good:     'meditation',         // 冥想
  Neutral:  'cleanUpRoom',        // 整理房間
  Sad:      'watchMovie',         // 當沙發馬鈴薯看電影
  Negative: 'musicRecommendation' // 撫慰系音樂推薦
  //出門散步十分鐘
};

// 2. 情緒分類常量（假設已存在於同目錄下）
import { Emotion_Categories } from './SelectEmojiScreen';

// 3. 根據加權選出最適合的一個活動 ID
/**
   @param {string[]} selectedEmotions - 使用者選的情緒文字陣列
  @param {string[]} [userPreferredActivities=[]] - 使用者偏好的活動 ID 陣列
  @returns {string|null} 推薦的活動 ID，若沒選任何情緒回傳 null
 */
export function recommendBestActivity(selectedEmotions = [], userPreferredActivities = []) {
  const emotionScores = {};
  selectedEmotions.forEach(text => {
    const catEntry = Object.values(Emotion_Categories)
      .find(cat => cat.emotions.some(e => e.text === text));
    if (!catEntry) return;

    const actId = categoryOneToOneMap[catEntry.category];
    if (actId) {
      emotionScores[actId] = (emotionScores[actId] || 0) + 1;
    }
});

  const emotionBasedEntries = Object.entries(emotionScores);
  if (emotionBasedEntries.length > 0 && userPreferredActivities && userPreferredActivities.length > 0) {
    const preferredAndEmotionBasedActivities = emotionBasedEntries.filter(([activityId]) =>
      userPreferredActivities.includes(activityId)
    );

  if (preferredAndEmotionBasedActivities.length > 0) {
      // 在這些活動中找出最高分
      const maxScoreInPreferred = Math.max(...preferredAndEmotionBasedActivities.map(([, score]) => score));
      const candidates = preferredAndEmotionBasedActivities
        .filter(([, score]) => score === maxScoreInPreferred)
        .map(([activityId]) => activityId);
      
      if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
    }
  }
  if (userPreferredActivities && userPreferredActivities.length > 0) {
    return userPreferredActivities[Math.floor(Math.random() * userPreferredActivities.length)];
  }

  // --- 一般推薦：如果上述仍無結果，從所有符合情緒的活動中選擇 ---
  if (emotionBasedEntries.length > 0) {
    const maxScoreGeneral = Math.max(...emotionBasedEntries.map(([, score]) => score));
    const candidates = emotionBasedEntries
      .filter(([, score]) => score === maxScoreGeneral)
      .map(([activityId]) => activityId);

    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
  }

  // 如果所有條件都不滿足，則返回 null
  return null;
}