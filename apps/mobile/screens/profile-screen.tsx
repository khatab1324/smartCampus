import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { tokens } from '@/constants/tokens';
import { useAuth } from '@/hooks/use-auth';
import { routes } from '@/navigation/routes';
import { withAlpha } from '@/utils/color';

type SettingsRow = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBackground: string;
  iconColor: string;
  id: string;
  label: string;
  value?: string;
};

const accountRows: SettingsRow[] = [
  {
    icon: 'person',
    iconBackground: withAlpha(tokens.colors.primary, 0.06),
    iconColor: tokens.colors.primary,
    id: 'personal-info',
    label: 'Personal Information',
  },
  {
    icon: 'lock',
    iconBackground: withAlpha(tokens.colors.primary, 0.06),
    iconColor: tokens.colors.primary,
    id: 'security-password',
    label: 'Security & Password',
  },
  {
    icon: 'notifications',
    iconBackground: withAlpha(tokens.colors.primary, 0.06),
    iconColor: tokens.colors.primary,
    id: 'notifications',
    label: 'Notifications',
  },
];

const appRows: SettingsRow[] = [
  {
    icon: 'language',
    iconBackground: withAlpha(tokens.colors.secondary, 0.06),
    iconColor: tokens.colors.secondary,
    id: 'language',
    label: 'Language',
    value: 'English',
  },
  {
    icon: 'help',
    iconBackground: withAlpha(tokens.colors.secondary, 0.06),
    iconColor: tokens.colors.secondary,
    id: 'help-support',
    label: 'Help & Support',
  },
];

export default function ProfileScreen() {
  const { profile } = useAuth();
  const [appearance, setAppearance] = useState<'light' | 'dark'>('light');

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Pressable
              onPress={() => router.replace(profile?.role === 'instructor' ? routes.instructor : routes.student)}
              style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
              <MaterialIcons color={tokens.colors.primary} name="arrow-back" size={22} />
            </Pressable>

            <Text style={styles.topBarTitle}>Profile</Text>
          </View>

          <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
            <MaterialIcons color={tokens.colors.primary} name="settings" size={22} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.portraitWrap}>
            <View style={styles.portraitCard}>
              <View style={styles.portraitGlow} />
              <Text style={styles.portraitInitials}>AH</Text>
            </View>

            <View style={styles.editBadge}>
              <MaterialIcons color={tokens.colors.onPrimary} name="edit" size={14} />
            </View>
          </View>

          <View style={styles.heroCopy}>
            <View style={styles.roleBadge}>
              <View style={styles.roleDot} />
              <Text style={styles.roleBadgeText}>Senior Student</Text>
            </View>

            <Text style={styles.heroTitle}>Ahmad Hassan</Text>
            <Text style={styles.heroSubtitle}>Department of Computer Science</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard icon="school" label="Active Classes" tone="primary" value="6" />
          <StatCard icon="analytics" label="Avg. Attendance" tone="tertiary" value="94%" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Settings</Text>
          <View style={styles.groupCard}>
            {accountRows.map((row, index) => (
              <SettingsButton
                key={row.id}
                hasDivider={index !== accountRows.length - 1}
                row={row}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>App Configuration</Text>
          <View style={styles.groupCard}>
            <SettingsButton hasDivider row={appRows[0]} />

            <View style={styles.inlineRow}>
              <View style={styles.inlineRowMain}>
                <View style={[styles.rowIconShell, { backgroundColor: withAlpha(tokens.colors.secondary, 0.06) }]}>
                  <MaterialIcons color={tokens.colors.secondary} name="palette" size={20} />
                </View>
                <Text style={styles.rowLabel}>Appearance</Text>
              </View>

              <View style={styles.appearanceSwitch}>
                <Pressable
                  onPress={() => setAppearance('light')}
                  style={({ pressed }) => [
                    styles.appearanceOption,
                    appearance === 'light' && styles.appearanceOptionActive,
                    pressed && styles.buttonPressed,
                  ]}>
                  <MaterialIcons
                    color={appearance === 'light' ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
                    name="light-mode"
                    size={16}
                  />
                </Pressable>

                <Pressable
                  onPress={() => setAppearance('dark')}
                  style={({ pressed }) => [
                    styles.appearanceOption,
                    appearance === 'dark' && styles.appearanceOptionActive,
                    pressed && styles.buttonPressed,
                  ]}>
                  <MaterialIcons
                    color={appearance === 'dark' ? tokens.colors.primary : tokens.colors.onSurfaceVariant}
                    name="dark-mode"
                    size={16}
                  />
                </Pressable>
              </View>
            </View>

            <SettingsButton row={appRows[1]} />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={({ pressed }) => [styles.logoutButton, pressed && styles.buttonPressed]}>
            <MaterialIcons color="#93000A" name="logout" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>

          <Text style={styles.versionText}>Smart Campus v2.4.1</Text>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

function StatCard({
  icon,
  label,
  tone,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  tone: 'primary' | 'secondary' | 'tertiary';
  value: string;
}) {
  const iconColor =
    tone === 'primary'
      ? tokens.colors.primary
      : tone === 'secondary'
        ? tokens.colors.secondary
        : tokens.colors.tertiary;
  const cardStyle =
    tone === 'primary'
      ? styles.statCardBase
      : tone === 'secondary'
        ? styles.statCardBase
        : styles.statCardSoft;

  return (
    <View style={cardStyle}>
      <MaterialIcons color={iconColor} name={icon} size={22} />
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statCaption}>{label}</Text>
      </View>
    </View>
  );
}

function SettingsButton({
  hasDivider,
  row,
}: {
  hasDivider?: boolean;
  row: SettingsRow;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.rowButton, hasDivider && styles.rowDivider, pressed && styles.buttonPressed]}>
      <View style={styles.rowMain}>
        <View style={[styles.rowIconShell, { backgroundColor: row.iconBackground }]}>
          <MaterialIcons color={row.iconColor} name={row.icon} size={20} />
        </View>
        <Text style={styles.rowLabel}>{row.label}</Text>
      </View>

      <View style={styles.rowSide}>
        {row.value ? <Text style={styles.rowValue}>{row.value}</Text> : null}
        <MaterialIcons color={tokens.colors.outlineVariant} name="chevron-right" size={22} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 140,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.lg,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.xxl,
  },
  topBarLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: tokens.radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  topBarTitle: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.title,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  hero: {
    flexDirection: 'row',
    gap: tokens.spacing.xl,
    marginBottom: tokens.spacing.xxxl,
  },
  portraitWrap: {
    position: 'relative',
  },
  portraitCard: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    borderWidth: 4,
    height: 128,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 128,
    ...tokens.shadows.floating,
  },
  portraitGlow: {
    backgroundColor: withAlpha(tokens.colors.primaryFixed, 0.28),
    borderRadius: 999,
    height: 120,
    position: 'absolute',
    right: -24,
    top: -22,
    width: 120,
  },
  portraitInitials: {
    color: tokens.colors.onPrimary,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  editBadge: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primary,
    borderRadius: 12,
    bottom: -8,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: -8,
    width: 32,
    ...tokens.shadows.soft,
  },
  heroCopy: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: tokens.spacing.sm,
  },
  roleBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: withAlpha(tokens.colors.tertiary, 0.1),
    borderRadius: tokens.radii.pill,
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  roleDot: {
    backgroundColor: tokens.colors.tertiary,
    borderRadius: tokens.radii.pill,
    height: 8,
    width: 8,
  },
  roleBadgeText: {
    color: tokens.colors.tertiary,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: tokens.colors.onSurface,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 38,
  },
  heroSubtitle: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.bodyLg,
    fontWeight: '500',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing.xxxl,
  },
  statCardBase: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderColor: withAlpha(tokens.colors.outlineVariant, 0.1),
    borderRadius: tokens.radii.xl,
    borderWidth: 1,
    flex: 1,
    gap: tokens.spacing.lg,
    minHeight: 116,
    padding: 20,
  },
  statCardSoft: {
    backgroundColor: tokens.colors.surfaceLow,
    borderColor: withAlpha(tokens.colors.outlineVariant, 0.06),
    borderRadius: tokens.radii.xl,
    borderWidth: 1,
    flex: 1,
    gap: tokens.spacing.lg,
    minHeight: 116,
    padding: 20,
  },
  statValue: {
    color: tokens.colors.onSurface,
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 2,
  },
  statCaption: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.micro,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: tokens.spacing.xxl,
  },
  sectionLabel: {
    color: withAlpha(tokens.colors.onSurfaceVariant, 0.6),
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: tokens.spacing.md,
    paddingHorizontal: 8,
    textTransform: 'uppercase',
  },
  groupCard: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderColor: withAlpha(tokens.colors.outlineVariant, 0.1),
    borderRadius: tokens.radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...tokens.shadows.soft,
  },
  rowButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  rowDivider: {
    borderBottomColor: withAlpha(tokens.colors.outlineVariant, 0.1),
    borderBottomWidth: 1,
  },
  rowMain: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  rowIconShell: {
    alignItems: 'center',
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  rowLabel: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.bodyLg,
    fontWeight: '500',
  },
  rowSide: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  rowValue: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '500',
  },
  inlineRow: {
    alignItems: 'center',
    borderBottomColor: withAlpha(tokens.colors.outlineVariant, 0.1),
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  inlineRowMain: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  appearanceSwitch: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: tokens.radii.pill,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  appearanceOption: {
    alignItems: 'center',
    borderRadius: tokens.radii.pill,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  appearanceOptionActive: {
    backgroundColor: tokens.colors.surfaceLowest,
    ...tokens.shadows.soft,
  },
  footer: {
    paddingTop: tokens.spacing.sm,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#FFDAD6',
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    justifyContent: 'center',
    minHeight: 56,
  },
  logoutText: {
    color: '#93000A',
    fontSize: tokens.typography.bodyLg,
    fontWeight: '800',
  },
  versionText: {
    color: withAlpha(tokens.colors.onSurfaceVariant, 0.4),
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: tokens.spacing.xl,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  buttonPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
});
