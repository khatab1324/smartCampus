import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { tokens } from '@/constants/tokens';
import { withAlpha } from '@/utils/color';

type FilterKey = 'all' | 'present' | 'late' | 'absent';

type HistoryEntry = {
  course: string;
  dateLabel: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBackground: string;
  iconColor: string;
  id: string;
  metaAction?: string;
  metaText: string;
  status: Exclude<FilterKey, 'all'>;
  statusLabel: string;
};

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'present', label: 'Present' },
  { key: 'late', label: 'Late' },
  { key: 'absent', label: 'Absent' },
];

const historyEntries: HistoryEntry[] = [
  {
    course: 'Advanced Architecture II',
    dateLabel: 'Oct 24, 2023 • 09:00 AM',
    icon: 'apartment',
    iconBackground: '#EAF2FF',
    iconColor: tokens.colors.primary,
    id: 'advanced-architecture-ii',
    metaText: 'Verified via BLE',
    status: 'present',
    statusLabel: 'Present',
  },
  {
    course: 'Applied Mathematics',
    dateLabel: 'Oct 23, 2023 • 02:30 PM',
    icon: 'functions',
    iconBackground: '#FFF2E9',
    iconColor: '#E06B00',
    id: 'applied-mathematics',
    metaText: 'Manual Entry',
    status: 'late',
    statusLabel: 'Late (12m)',
  },
  {
    course: 'Human Behavior Study',
    dateLabel: 'Oct 22, 2023 • 11:00 AM',
    icon: 'psychology',
    iconBackground: '#FFECEE',
    iconColor: '#C62828',
    id: 'human-behavior-study',
    metaAction: 'Submit Appeal',
    metaText: 'Absent',
    status: 'absent',
    statusLabel: 'Absent',
  },
  {
    course: 'Data Structures & Algo',
    dateLabel: 'Oct 21, 2023 • 08:00 AM',
    icon: 'storage',
    iconBackground: '#F3EEFF',
    iconColor: '#7E57C2',
    id: 'data-structures-algo',
    metaText: 'Verified via QR',
    status: 'present',
    statusLabel: 'Present',
  },
];

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const visibleEntries =
    activeFilter === 'all'
      ? historyEntries
      : historyEntries.filter((entry) => entry.status === activeFilter);

  return (
    <ScreenShell>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.avatarShell}>
              <Text style={styles.avatarText}>AH</Text>
            </View>
            <Text style={styles.topBarTitle}>Smart Campus</Text>
          </View>

          <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
            <MaterialIcons color={tokens.colors.onSurface} name="notifications-none" size={22} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Personal Logs</Text>
            <Text style={styles.title}>Attendance History</Text>
            <Text style={styles.subtitle}>
              Review your presence across all enrolled courses and track your academic consistency.
            </Text>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Rate</Text>
                <Text style={styles.statValuePrimary}>94.2%</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Sessions</Text>
                <Text style={styles.statValue}>48/51</Text>
              </View>
            </View>

            <View style={styles.streakCard}>
              <View>
                <Text style={styles.statLabel}>Streak</Text>
                <View style={styles.streakValueRow}>
                  <Text style={styles.streakValue}>12</Text>
                  <MaterialIcons color={tokens.colors.tertiary} name="local-fire-department" size={22} />
                </View>
              </View>

              <MaterialIcons
                color={withAlpha(tokens.colors.onSurface, 0.05)}
                name="verified"
                size={72}
                style={styles.streakBackgroundIcon}
              />
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.filterRow}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => {
              const isActive = activeFilter === filter.key;

              return (
                <Pressable
                  key={filter.key}
                  onPress={() => setActiveFilter(filter.key)}
                  style={({ pressed }) => [
                    isActive ? styles.filterChipActive : styles.filterChip,
                    pressed && styles.buttonPressed,
                  ]}>
                  <Text style={isActive ? styles.filterChipTextActive : styles.filterChipText}>
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.logList}>
            {visibleEntries.map((entry) => {
              const badgeStyle =
                entry.status === 'present'
                  ? styles.presentBadge
                  : entry.status === 'late'
                    ? styles.lateBadge
                    : styles.absentBadge;
              const badgeTextStyle =
                entry.status === 'present'
                  ? styles.presentBadgeText
                  : entry.status === 'late'
                    ? styles.lateBadgeText
                    : styles.absentBadgeText;

              return (
                <View key={entry.id} style={styles.logCard}>
                  <View style={styles.logMain}>
                    <View style={[styles.logIconShell, { backgroundColor: entry.iconBackground }]}>
                      <MaterialIcons color={entry.iconColor} name={entry.icon} size={24} />
                    </View>

                    <View style={styles.logCopy}>
                      <Text style={styles.logTitle}>{entry.course}</Text>
                      <View style={styles.logMetaRow}>
                        <MaterialIcons
                          color={tokens.colors.onSurfaceVariant}
                          name="calendar-today"
                          size={12}
                        />
                        <Text style={styles.logDate}>{entry.dateLabel}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.logSide}>
                    <View style={[styles.statusBadge, badgeStyle]}>
                      <Text style={[styles.statusBadgeText, badgeTextStyle]}>{entry.statusLabel}</Text>
                    </View>

                    {entry.metaAction ? (
                      <Pressable style={({ pressed }) => [pressed && styles.buttonPressed]}>
                        <Text style={styles.metaAction}>{entry.metaAction}</Text>
                      </Pressable>
                    ) : (
                      <Text style={styles.logMetaNote}>{entry.metaText}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.footerHint}>
            <MaterialIcons color={tokens.colors.onSurfaceVariant} name="history-edu" size={36} />
            <Text style={styles.footerHintText}>Viewing logs from the last 30 days</Text>
          </View>
        </ScrollView>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomColor: tokens.effects.cardBorder,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.lg,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  avatarShell: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: tokens.radii.pill,
    height: 40,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 40,
  },
  avatarText: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.label,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  topBarTitle: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.title,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: tokens.radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  content: {
    paddingBottom: 140,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.xl,
  },
  header: {
    marginBottom: tokens.spacing.xxxl,
  },
  eyebrow: {
    color: tokens.colors.tertiary,
    fontSize: tokens.typography.label,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: tokens.spacing.xs,
    textTransform: 'uppercase',
  },
  title: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.display,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  subtitle: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    lineHeight: 22,
    marginTop: tokens.spacing.sm,
    maxWidth: 320,
  },
  filterRow: {
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.xxxl,
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: tokens.radii.pill,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 24,
  },
  filterChipActive: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.pill,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 24,
    ...tokens.shadows.soft,
  },
  filterChipText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: tokens.colors.onPrimary,
    fontSize: tokens.typography.body,
    fontWeight: '700',
  },
  statsSection: {
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.lg,
  },
  statCard: {
    backgroundColor: tokens.colors.surfaceLow,
    borderRadius: tokens.radii.xl,
    flex: 1,
    minHeight: 124,
    padding: tokens.spacing.xl,
  },
  statLabel: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  statValue: {
    color: tokens.colors.onSurface,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 'auto',
  },
  statValuePrimary: {
    color: tokens.colors.primary,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 'auto',
  },
  streakCard: {
    backgroundColor: tokens.colors.surfaceLow,
    borderRadius: tokens.radii.xl,
    minHeight: 124,
    overflow: 'hidden',
    padding: tokens.spacing.xl,
    position: 'relative',
  },
  streakValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    marginTop: 'auto',
  },
  streakValue: {
    color: tokens.colors.tertiary,
    fontSize: 32,
    fontWeight: '900',
  },
  streakBackgroundIcon: {
    bottom: 12,
    position: 'absolute',
    right: 12,
  },
  logList: {
    gap: tokens.spacing.lg,
  },
  logCard: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    ...tokens.shadows.soft,
  },
  logMain: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
  },
  logIconShell: {
    alignItems: 'center',
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  logCopy: {
    flex: 1,
  },
  logTitle: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.title,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: tokens.spacing.xs,
  },
  logMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  logDate: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
  },
  logSide: {
    alignItems: 'flex-end',
    gap: tokens.spacing.sm,
    marginLeft: tokens.spacing.md,
  },
  statusBadge: {
    borderRadius: tokens.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  presentBadge: {
    backgroundColor: '#ECFDF3',
  },
  lateBadge: {
    backgroundColor: '#FFF4E5',
  },
  absentBadge: {
    backgroundColor: '#FFF1F2',
  },
  statusBadgeText: {
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  presentBadgeText: {
    color: '#15803D',
  },
  lateBadgeText: {
    color: '#C2410C',
  },
  absentBadgeText: {
    color: '#BE123C',
  },
  logMetaNote: {
    color: tokens.colors.outline,
    fontSize: 10,
    fontStyle: 'italic',
  },
  metaAction: {
    color: tokens.colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  footerHint: {
    alignItems: 'center',
    opacity: 0.45,
    paddingBottom: tokens.spacing.xl,
    paddingTop: 48,
  },
  footerHintText: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.body,
    fontWeight: '500',
    marginTop: tokens.spacing.sm,
  },
  buttonPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
});
