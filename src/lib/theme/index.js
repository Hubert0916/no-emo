export const Colors = {
  primary: '#7895B2',        // Blue-gray for buttons
  secondary: '#A2B5BD',      // Light blue-gray for secondary elements
  accent: '#F5E1DA',         // Soft peach for selected states
  background: '#F0F8FF',     // Alice blue for main background
  surface: '#FFFFFF',        // White for cards and input backgrounds
  textPrimary: '#333333',    // Dark gray for primary text
  textSecondary: '#616161',   // Medium gray for secondary text
  placeholder: '#888888',     // Gray for placeholder text
  border: '#DADADA',          // Light gray for borders
  error: '#D32F2F',           // Red for error messages
  success: '#4CAF50',         // Green for success messages

  // Neutral colors for ProfileSetupScreen
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
  md: 12,
  lg: 15,
  xl: 20,
  xxl: 30,
};

export const BorderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 15,
  circle: 60,
};

const Theme = {
  Colors,
  Fonts,
  Spacing,
  BorderRadius,
};

export default Theme;