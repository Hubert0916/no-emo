export const Colors = {
  primary: '#7895B2',        // 中藍灰色 (例如：按鈕背景)
  secondary: '#A2B5BD',      // 淺藍灰色 (例如：次要元素或背景)
  accent: '#F5E1DA',         // 柔和粉橙色 (例如：選中狀態)
  background: '#F0F8FF',     // 愛麗絲藍 (主要背景)
  surface: '#FFFFFF',        // 白色 (例如：卡片、輸入框背景)
  textPrimary: '#333333',    // 深灰色 (主要文字)
  textSecondary: '#616161',   // 中灰色 (次要文字、副標題)
  placeholder: '#888888',    // 灰色 (輸入框提示文字)
  border: '#DADADA',         // 淺灰色 (邊框)
  error: '#D32F2F',          // 紅色 (錯誤提示)
  success: '#4CAF50',        // 綠色 (成功提示)
  neutralBackground: '#F2F2F2',
  neutralText: '#455A64',
  neutralBorder: '#DADADA',
  neutralPlaceholderBg: '#EBEBEB',
  neutralTagSelectedBg: '#E0E6ED',
  neutralTagSelectedBorder: '#7895B2',
  neutralButton: '#7895B2',
};

export const Fonts = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12, // 之前 tagOption 的 padding
  lg: 15, // 之前 input 的 padding
  xl: 20, // 之前 title 的 marginBottom
  xxl: 30, // 之前 container 的 padding
};

export const BorderRadius = {
  sm: 8,  // 之前 tagOption
  md: 10, // 之前 button
  lg: 12, // 之前 input
  xl: 15,
  circle: 60, // 之前 profileImage
};

export const ActivityStyle = {
  cardBackground: '#F9F9F9',
  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    background: '#4A90E2',
    text: '#FFF',
  },
};

export const ActivityColors = {
  food: '#FFB347',                // 橘黃色（食物）
  meditation: '#B2DFDB',          // 清新綠（冥想）
  cleanUpRoom: '#AED581',         // 草地綠（整理房間）
  watchMovie: '#90CAF9',          // 藍色（看電影）
  musicRecommendation: '#CE93D8'  // 柔紫色（音樂）
};

export const ActivityIcons = {
  food: '🍱',
  meditation: '🧘',
  cleanUpRoom: '🧹',
  watchMovie: '🎬',
  musicRecommendation: '🎧'
};

const Theme = {
  Colors,
  Fonts,
  Spacing,
  BorderRadius,
  ActivityColors,  
  ActivityIcons,
  ActivityStyle,   
};

export default Theme;