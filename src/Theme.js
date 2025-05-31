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

  // 你在 ProfileSetupScreen 中使用的中性色系
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

const Theme = {
  Colors,
  Fonts,
  Spacing,
  BorderRadius,
};

export default Theme;