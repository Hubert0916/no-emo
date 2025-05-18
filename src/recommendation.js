export const categoryOneToOneMap = {
  Positive: 'food',               // 吃點喜歡的食物
  Good:     'meditation',         // 冥想
  Neutral:  'cleanUpRoom',        // 整理房間
  Sad:      'watchMovie',         // 當沙發馬鈴薯看電影
  Negative: 'musicRecommendation' // 撫慰系音樂推薦
};

// 2. 情緒分類常量（假設已存在於同目錄下）
import { Emotion_Categories } from './Selectemoji';

// 3. 根據加權選出最適合的一個活動 ID
/**
 * @param {string[]} selectedEmotions - 使用者選的情緒文字陣列
 * @returns {string|null} 推薦的活動 ID，若沒選任何情緒回傳 null
 */
export function recommendBestActivity(selectedEmotions = []) {
  const score = {};

  // 計分：每遇到一次該分類就 +1
  selectedEmotions.forEach(text => {
    const catEntry = Object.values(Emotion_Categories)
      .find(cat => cat.emotions.some(e => e.text === text));
    if (!catEntry) return;

    const actId = categoryOneToOneMap[catEntry.category];
    if (actId) score[actId] = (score[actId] || 0) + 1;
  });

  const entries = Object.entries(score);
  if (!entries.length) return null;

  // 找出最高分
  const maxScore = Math.max(...entries.map(([, s]) => s));

  // 平手時隨機挑一個
  const topCandidates = entries
    .filter(([, s]) => s === maxScore)
    .map(([id]) => id);

  return topCandidates[
    Math.floor(Math.random() * topCandidates.length)
  ];
}
