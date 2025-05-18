// RecommendResult.js
import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function RecommendResult() {
  const route = useRoute();
  const { activityId } = route.params;

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>🎉 推薦活動 🎉</Text>
      <Text style={{ fontSize: 20, color: '#333' }}>
        {activityId || '沒有拿到活動 ID'}
      </Text>
    </View>
  );
}
