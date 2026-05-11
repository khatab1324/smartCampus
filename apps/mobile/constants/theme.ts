import { Platform } from "react-native";

import { darkColors, lightColors } from "@/constants/tokens";

export const Colors = {
  light: {
    text: lightColors.onSurface,
    background: lightColors.background,
    tint: lightColors.primary,
    icon: lightColors.outline,
    tabIconDefault: lightColors.outline,
    tabIconSelected: lightColors.primary,
  },
  dark: {
    text: darkColors.onSurface,
    background: darkColors.background,
    tint: darkColors.primary,
    icon: darkColors.outline,
    tabIconDefault: darkColors.outline,
    tabIconSelected: darkColors.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
