import { DefaultTheme } from '@react-navigation/native';

import { withAlpha } from '@/utils/color';

export const lightColors = {
  background: '#F9F9FF',
  primary: '#0058BC',
  primaryContainer: '#0070EB',
  primaryFixed: '#D8E2FF',
  primarySoft: '#EAF2FF',
  secondary: '#405E96',
  tertiary: '#9E3D00',
  error: '#BA1A1A',
  success: '#2E7D32',
  successSoft: '#E8F5E9',
  dangerSoft: '#FDECEC',
  surface: '#F9F9FF',
  surfaceLow: '#F1F3FE',
  surfaceLowest: '#FFFFFF',
  surfaceHigh: '#E6E8F3',
  surfaceHighest: '#E0E2ED',
  onSurface: '#181C23',
  onSurfaceVariant: '#414755',
  onPrimary: '#FFFFFF',
  onPrimaryFixed: '#001A41',
  outline: '#717786',
  outlineVariant: '#C1C6D7',
};

export const darkColors: typeof lightColors = {
  background: '#0B1018',
  primary: '#9CC2FF',
  primaryContainer: '#2F6FD6',
  primaryFixed: '#17365F',
  primarySoft: '#10243F',
  secondary: '#B6C8F4',
  tertiary: '#FFB690',
  error: '#FFB4AB',
  success: '#9CD69F',
  successSoft: '#16361D',
  dangerSoft: '#3A1715',
  surface: '#0B1018',
  surfaceLow: '#121A26',
  surfaceLowest: '#172130',
  surfaceHigh: '#222D3D',
  surfaceHighest: '#2D394A',
  onSurface: '#EEF2FA',
  onSurfaceVariant: '#BFC7D6',
  onPrimary: '#062449',
  onPrimaryFixed: '#D8E2FF',
  outline: '#929BAD',
  outlineVariant: '#404B5D',
};

const colors = lightColors;

export type AppColorTokens = typeof lightColors;
export type AppColorScheme = 'light' | 'dark';
export type AppThemePreference = AppColorScheme | 'system';

export const tokens = {
  colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 44,
  },
  radii: {
    sm: 4,
    md: 16,
    xl: 24,
    pill: 9999,
  },
  typography: {
    display: 40,
    headline: 24,
    title: 18,
    body: 14,
    bodyLg: 16,
    label: 12,
    micro: 10,
  },
  shadows: {
    soft: {
      shadowColor: colors.onSurface,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 2,
    },
    floating: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 3,
    },
    card: {
      shadowColor: colors.onSurface,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.06,
      shadowRadius: 32,
      elevation: 2,
    },
  },
  chrome: {
    bottomBar: withAlpha('#FFFFFF', 0.96),
    footerPill: withAlpha('#E6E8F3', 0.8),
  },
  effects: {
    primaryGlow: withAlpha(colors.primaryContainer, 0.55),
    topGlow: withAlpha(colors.primaryContainer, 0.08),
    bottomGlow: withAlpha(colors.tertiary, 0.07),
    divider: withAlpha(colors.outlineVariant, 0.5),
    fieldBorder: withAlpha(colors.outlineVariant, 0.45),
    cardBorder: withAlpha(colors.outlineVariant, 0.15),
  },
};

export function getNavigationTheme(themeColors: AppColorTokens = colors) {
  return {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: themeColors.background,
      border: themeColors.outlineVariant,
      card: themeColors.surfaceLowest,
      notification: themeColors.tertiary,
      primary: themeColors.primary,
      text: themeColors.onSurface,
    },
    dark: themeColors === darkColors,
  };
}

export const navigationTheme = getNavigationTheme(colors);

export function getThemeColors(colorScheme: AppColorScheme) {
  return colorScheme === 'dark' ? darkColors : lightColors;
}

export function getThemeChrome(themeColors: AppColorTokens) {
  return {
    bottomBar: withAlpha(themeColors.surfaceLowest, 0.96),
    footerPill: withAlpha(themeColors.surfaceHigh, 0.8),
  };
}

export function getThemeEffects(themeColors: AppColorTokens) {
  return {
    primaryGlow: withAlpha(themeColors.primaryContainer, 0.55),
    topGlow: withAlpha(themeColors.primaryContainer, 0.08),
    bottomGlow: withAlpha(themeColors.tertiary, 0.07),
    divider: withAlpha(themeColors.outlineVariant, 0.5),
    fieldBorder: withAlpha(themeColors.outlineVariant, 0.45),
    cardBorder: withAlpha(themeColors.outlineVariant, 0.15),
  };
}

export function getThemeNativeWindVariables(themeColors: AppColorTokens) {
  return Object.fromEntries(
    Object.entries(themeColors).map(([name, value]) => [`color-${name}`, hexToRgbChannels(value)])
  );
}

function hexToRgbChannels(hex: string) {
  const normalized = hex.replace('#', '');

  if (normalized.length !== 6) {
    return '0 0 0';
  }

  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `${red} ${green} ${blue}`;
}
