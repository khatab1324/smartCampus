import { Platform } from 'react-native';

import { tokens } from '@/constants/tokens';

export const Colors = {
  light: {
    text: tokens.colors.onSurface,
    background: tokens.colors.background,
    tint: tokens.colors.primary,
    icon: tokens.colors.outline,
    tabIconDefault: tokens.colors.outline,
    tabIconSelected: tokens.colors.primary,
  },
  dark: {
    text: tokens.colors.onSurface,
    background: tokens.colors.background,
    tint: tokens.colors.primary,
    icon: tokens.colors.outline,
    tabIconDefault: tokens.colors.outline,
    tabIconSelected: tokens.colors.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
