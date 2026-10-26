/**
 * Minum Water Tracker - Theme Constants
 * Fresh water-themed color palette with light and dark mode support.
 */
import { Platform } from 'react-native';

export const WaterColors = {
  primary: '#4FC3F7',
  primaryDark: '#0288D1',
  secondary: '#00BFA5',
  accent: '#26C6DA',
  success: '#66BB6A',
  warning: '#FFA726',
  error: '#EF5350',
  ripple: '#81D4FA',
} as const;

export const Colors = {
  light: {
    text: '#1A2138',
    textSecondary: '#6B7280',
    background: '#F0F9FF',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E0F2FE',
    card: '#FFFFFF',
    border: '#E0E7EE',
    tabBar: '#FFFFFF',
    tabBarInactive: '#9CA3AF',
    progressTrack: '#E0F2FE',
    progressFill: '#4FC3F7',
    glassButton: '#FFFFFF',
    glassButtonBorder: '#B3E5FC',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    text: '#F0F9FF',
    textSecondary: '#94A3B8',
    background: '#0A1929',
    backgroundElement: '#132F4C',
    backgroundSelected: '#173A5E',
    card: '#132F4C',
    border: '#1E3A5F',
    tabBar: '#0D2137',
    tabBarInactive: '#64748B',
    progressTrack: '#173A5E',
    progressFill: '#4FC3F7',
    glassButton: '#132F4C',
    glassButtonBorder: '#1E4976',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  display: 48,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
