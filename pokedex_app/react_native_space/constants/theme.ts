import { Platform } from 'react-native';

export const COLORS = {
  primary: '#DC2626',
  accent: '#FACC15',
  backgroundDark: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceElevated: '#242424',
  textPrimary: '#F5F5F5',
  textSecondary: '#A3A3A3',
  error: '#EF4444',
  success: '#22C55E',
  white: '#FFFFFF',
  black: '#000000',
};

export const FONTS = {
  display: Platform.select({ ios: 'System', android: 'Roboto', default: 'Arial, sans-serif' }),
  body: Platform.select({ ios: 'System', android: 'Roboto', default: 'Arial, sans-serif' }),
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
