import { DefaultTheme } from '@react-navigation/native';

export const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(193, 196, 192)',
    primary: 'rgb(3, 0, 1)',
    accent: '#37474F',        // 深藍灰色，替代原先的深灰色
    accentLight: '#F5F5F5',   // 淺米灰色
    border: '#607D8B',        // 中灰藍色
  },
};