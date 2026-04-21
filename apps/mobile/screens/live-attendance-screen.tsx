import { useEffect, useMemo, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ScreenShell } from '@/components/screen-shell';
import { liveAttendanceParticipants } from '@/constants/instructor-mocks';
import { tokens } from '@/constants/tokens';
import { useAuth } from '@/hooks/use-auth';
import { getInitialsFromEmail } from '@/utils/user';
import { withAlpha } from '@/utils/color';

type AttendanceEvent = {
  id: string;
  name: string;
  status: string;
};

export default function LiveAttendanceScreen() {
  const params = useLocalSearchParams<{
    days?: string;
    lectureName?: string;
    startTime?: string;
  }>();
  const { authUser } = useAuth();
  const [activeCount, setActiveCount] = useState(41);
  const [attendanceFeed, setAttendanceFeed] = useState<AttendanceEvent[]>(liveAttendanceParticipants);

  const lectureName = params.lectureName || 'Distributed Systems';
  const startTime = params.startTime || '09:00 AM';
  const recurrence = params.days ? params.days.split(',').filter(Boolean).join(' • ') : 'Sun • Tue • Thu';
  const initials = getInitialsFromEmail(authUser?.email ?? 'instructor@smartcampus.edu');

  useEffect(() => {
    const interval = setInterval(() => {
      setAttendanceFeed((current) => {
        const nextStudent = current[(current.length - 1) % liveAttendanceParticipants.length];
        const nextFeed = [
          {
            id: `${Date.now()}`,
            name: nextStudent.name,
            status: 'Checked in just now',
          },
          ...current.slice(0, 4),
        ];

        return nextFeed;
      });
      setActiveCount((current) => current + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const attendanceRate = useMemo(() => `${Math.min(99, activeCount)}%`, [activeCount]);

  return (
    <ScreenShell>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
              <MaterialIcons color={tokens.colors.primary} name="arrow-back" size={22} />
            </Pressable>
            <Text style={styles.topBarTitle}>Live Attendance</Text>
          </View>

          <View style={styles.avatarShell}>
            <Text style={styles.avatarText}>{initials || 'IN'}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroTopRow}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>Live Now</Text>
              </View>

              <View style={styles.timeBadge}>
                <MaterialIcons color={tokens.colors.onPrimaryFixed} name="schedule" size={14} />
                <Text style={styles.timeBadgeText}>{startTime}</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>{lectureName}</Text>
            <Text style={styles.heroSubtitle}>Recurring on {recurrence}</Text>
          </View>

          <View style={styles.metricGrid}>
            <MetricCard
              icon="groups"
              label="Checked In"
              tone="primary"
              value={String(activeCount)}
            />
            <MetricCard
              icon="analytics"
              label="Attendance Rate"
              tone="tertiary"
              value={attendanceRate}
            />
          </View>

          <View style={styles.focusCard}>
            <View style={styles.focusHeader}>
              <Text style={styles.focusTitle}>Live Session Beacon</Text>
              <View style={styles.readyBadge}>
                <MaterialIcons color={tokens.colors.success} name="wifi-tethering" size={16} />
                <Text style={styles.readyBadgeText}>Broadcasting</Text>
              </View>
            </View>

            <Text style={styles.focusCode}>ATT-{lectureName.slice(0, 3).toUpperCase()}-24</Text>
            <Text style={styles.focusDescription}>
              Students joining nearby will appear below in real time as their attendance hits the session.
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Real-Time Check-Ins</Text>
            <Text style={styles.sectionMeta}>Auto refreshing</Text>
          </View>

          <View style={styles.feedList}>
            {attendanceFeed.map((entry) => (
              <View key={entry.id} style={styles.feedCard}>
                <View style={styles.feedAvatar}>
                  <Text style={styles.feedAvatarText}>
                    {entry.name
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase())
                      .join('')}
                  </Text>
                </View>

                <View style={styles.feedCopy}>
                  <Text style={styles.feedName}>{entry.name}</Text>
                  <Text style={styles.feedStatus}>{entry.status}</Text>
                </View>

                <MaterialIcons color={tokens.colors.success} name="check-circle" size={22} />
              </View>
            ))}
          </View>

          <Pressable style={({ pressed }) => [styles.endSessionButton, pressed && styles.buttonPressed]}>
            <MaterialIcons color={tokens.colors.error} name="stop-circle" size={20} />
            <Text style={styles.endSessionText}>End Live Attendance</Text>
          </Pressable>
        </ScrollView>
      </View>
    </ScreenShell>
  );
}

function MetricCard({
  icon,
  label,
  tone,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  tone: 'primary' | 'tertiary';
  value: string;
}) {
  const iconColor = tone === 'primary' ? tokens.colors.primary : tokens.colors.tertiary;

  return (
    <View style={[styles.metricCard, tone === 'tertiary' && styles.metricCardWarm]}>
      <MaterialIcons color={iconColor} name={icon} size={24} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarShell: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primaryFixed,
    borderRadius: tokens.radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  avatarText: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.label,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  container: {
    flex: 1,
  },
  content: {
    gap: tokens.spacing.xl,
    paddingBottom: 56,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.xl,
  },
  endSessionButton: {
    alignItems: 'center',
    backgroundColor: withAlpha(tokens.colors.error, 0.1),
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  endSessionText: {
    color: tokens.colors.error,
    fontSize: tokens.typography.body,
    fontWeight: '800',
  },
  feedAvatar: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primaryFixed,
    borderRadius: tokens.radii.pill,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  feedAvatarText: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.label,
    fontWeight: '800',
  },
  feedCard: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    gap: tokens.spacing.md,
    padding: tokens.spacing.lg,
    ...tokens.shadows.soft,
  },
  feedCopy: {
    flex: 1,
    gap: 2,
  },
  feedList: {
    gap: tokens.spacing.md,
  },
  feedName: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.bodyLg,
    fontWeight: '700',
  },
  feedStatus: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
  },
  focusCard: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    gap: tokens.spacing.md,
    padding: tokens.spacing.xl,
    ...tokens.shadows.card,
  },
  focusCode: {
    color: tokens.colors.primary,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  focusDescription: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    lineHeight: 22,
  },
  focusHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  focusTitle: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.title,
    fontWeight: '800',
  },
  hero: {
    gap: tokens.spacing.sm,
  },
  heroSubtitle: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.bodyLg,
    fontWeight: '600',
  },
  heroTitle: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.display,
    fontWeight: '900',
    letterSpacing: -1.4,
    lineHeight: 42,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: tokens.radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  liveBadge: {
    alignItems: 'center',
    backgroundColor: withAlpha(tokens.colors.tertiary, 0.12),
    borderRadius: tokens.radii.pill,
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveBadgeText: {
    color: tokens.colors.onPrimaryFixed,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  liveDot: {
    backgroundColor: tokens.colors.tertiary,
    borderRadius: tokens.radii.pill,
    height: 8,
    width: 8,
  },
  metricCard: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    flex: 1,
    gap: tokens.spacing.sm,
    padding: tokens.spacing.lg,
    ...tokens.shadows.soft,
  },
  metricCardWarm: {
    backgroundColor: withAlpha(tokens.colors.tertiary, 0.08),
  },
  metricGrid: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  metricLabel: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '700',
  },
  metricValue: {
    color: tokens.colors.onSurface,
    fontSize: 28,
    fontWeight: '900',
  },
  readyBadge: {
    alignItems: 'center',
    backgroundColor: withAlpha(tokens.colors.success, 0.1),
    borderRadius: tokens.radii.pill,
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  readyBadgeText: {
    color: tokens.colors.success,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionMeta: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '600',
  },
  sectionTitle: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.title,
    fontWeight: '800',
  },
  timeBadge: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primaryFixed,
    borderRadius: tokens.radii.pill,
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeBadgeText: {
    color: tokens.colors.onPrimaryFixed,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
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
  topBarLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  topBarTitle: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.title,
    fontWeight: '800',
  },
});
