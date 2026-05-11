import { withAlpha } from '@/utils/color';

type ProfileThemeColors = {
  background: string;
  onPrimary: string;
  onSurface: string;
  onSurfaceVariant: string;
  outlineVariant: string;
  primary: string;
  primaryFixed: string;
  secondary: string;
  success: string;
  surfaceHigh: string;
  surfaceLow: string;
  surfaceLowest: string;
  tertiary: string;
};

export function createProfileThemeStyles(themeColors: ProfileThemeColors) {
  return {
    appearanceOptionActive: {
      backgroundColor: themeColors.surfaceLowest,
    },
    appearanceSwitch: {
      backgroundColor: themeColors.surfaceHigh,
    },
    editBadge: {
      backgroundColor: themeColors.primary,
    },
    groupCard: {
      backgroundColor: themeColors.surfaceLowest,
      borderColor: withAlpha(themeColors.outlineVariant, 0.18),
    },
    heroSubtitle: {
      color: themeColors.onSurfaceVariant,
    },
    heroTitle: {
      color: themeColors.onSurface,
    },
    inlineRow: {
      borderBottomColor: withAlpha(themeColors.outlineVariant, 0.16),
    },
    liveSummary: {
      backgroundColor: withAlpha(themeColors.success, 0.1),
    },
    liveSummaryText: {
      color: themeColors.success,
    },
    paletteIconShell: {
      backgroundColor: withAlpha(themeColors.secondary, 0.12),
    },
    portraitCard: {
      backgroundColor: themeColors.primary,
      borderColor: themeColors.surfaceLowest,
    },
    portraitGlow: {
      backgroundColor: withAlpha(themeColors.primaryFixed, 0.28),
    },
    portraitInitials: {
      color: themeColors.onPrimary,
    },
    roleBadge: {
      backgroundColor: withAlpha(themeColors.tertiary, 0.1),
    },
    roleBadgeText: {
      color: themeColors.tertiary,
    },
    roleDot: {
      backgroundColor: themeColors.tertiary,
    },
    rowDivider: {
      borderBottomColor: withAlpha(themeColors.outlineVariant, 0.16),
    },
    rowLabel: {
      color: themeColors.onSurface,
    },
    rowValue: {
      color: themeColors.onSurfaceVariant,
    },
    screenBackground: {
      backgroundColor: themeColors.background,
    },
    sectionLabel: {
      color: withAlpha(themeColors.onSurfaceVariant, 0.6),
    },
    statCaption: {
      color: themeColors.onSurfaceVariant,
    },
    statCard: {
      backgroundColor: themeColors.surfaceLowest,
      borderColor: withAlpha(themeColors.outlineVariant, 0.16),
    },
    statCardTertiary: {
      backgroundColor: themeColors.surfaceLow,
      borderColor: withAlpha(themeColors.outlineVariant, 0.16),
    },
    statValue: {
      color: themeColors.onSurface,
    },
    topBarTitle: {
      color: themeColors.onSurface,
    },
    versionText: {
      color: withAlpha(themeColors.onSurfaceVariant, 0.5),
    },
  };
}
