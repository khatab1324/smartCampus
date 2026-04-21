import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { instructorLectureCards, instructorSummary } from '@/constants/instructor-mocks';
import { tokens } from '@/constants/tokens';
import { useAuth } from '@/hooks/use-auth';
import { openCreateLectureScreen, openLiveAttendanceScreen } from '@/services/instructor-navigation.service';
import { getDisplayNameFromEmail, getInitialsFromEmail } from '@/utils/user';
import { withAlpha } from '@/utils/color';

export default function InstructorDashboardScreen() {
  const { authUser } = useAuth();
  const email = authUser?.email ?? 'instructor@smartcampus.edu';
  const displayName = getDisplayNameFromEmail(email);
  const initials = getInitialsFromEmail(email);

  return (
    <ScreenShell>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.topBarBrand}>
            <View style={styles.avatarShell}>
              <Text style={styles.avatarText}>{initials || 'IN'}</Text>
            </View>
            <View>
              <Text style={styles.topBarLabel}>Instructor Console</Text>
              <Text style={styles.topBarTitle}>Smart Campus</Text>
            </View>
          </View>

          <Pressable
            onPress={openCreateLectureScreen}
            style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}>
            <MaterialIcons color={tokens.colors.onPrimary} name="add" size={22} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>Live Faculty Mode</Text>
            </View>

            <Text style={styles.heroTitle}>Welcome back, {displayName}</Text>
            <Text style={styles.heroSubtitle}>
              Launch a lecture, monitor check-ins live, and keep classroom attendance flowing in real time.
            </Text>
          </View>

          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="school"
              label="Active Lectures"
              tone="primary"
              value={String(instructorSummary.activeLectures)}
            />
            <SummaryCard
              icon="groups"
              label="Live Students"
              tone="secondary"
              value={String(instructorSummary.liveStudents)}
            />
            <SummaryCard
              icon="analytics"
              label="Attendance Rate"
              tone="tertiary"
              value={instructorSummary.attendanceRate}
            />
          </View>

          <View style={styles.actionCard}>
            <View style={styles.actionCardIcon}>
              <MaterialIcons color={tokens.colors.primary} name="add-circle-outline" size={24} />
            </View>

            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Start a new lecture</Text>
              <Text style={styles.actionBody}>
                Create a lecture, assign recurring days, and move straight into the live attendance view.
              </Text>
            </View>

            <Pressable
              onPress={openCreateLectureScreen}
              style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}>
              <Text style={styles.actionButtonText}>Create Lecture</Text>
              <MaterialIcons color={tokens.colors.onPrimary} name="arrow-forward" size={18} />
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Lectures</Text>
            <Text style={styles.sectionMeta}>Tap one to reopen live attendance</Text>
          </View>

          <View style={styles.lectureList}>
            {instructorLectureCards.map((lecture) => (
              <Pressable
                key={lecture.code}
                onPress={() =>
                  openLiveAttendanceScreen({
                    days: ['Sun', 'Tue', 'Thu'],
                    lectureName: lecture.title,
                    startTime: lecture.startTime,
                  })
                }
                style={({ pressed }) => [styles.lectureCard, pressed && styles.buttonPressed]}>
                <View style={styles.lectureHeader}>
                  <View>
                    <View style={styles.lectureCodeChip}>
                      <Text style={styles.lectureCodeText}>{lecture.code}</Text>
                    </View>
                    <Text style={styles.lectureTitle}>{lecture.title}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      lecture.status === 'Live Now' ? styles.statusBadgeLive : styles.statusBadgeSoon,
                    ]}>
                    <Text
                      style={[
                        styles.statusBadgeText,
                        lecture.status === 'Live Now'
                          ? styles.statusBadgeTextLive
                          : styles.statusBadgeTextSoon,
                      ]}>
                      {lecture.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.lectureMetaRow}>
                  <LectureMeta icon="schedule" text={lecture.startTime} />
                  <LectureMeta icon="location-on" text={lecture.room} />
                  <LectureMeta icon="group" text={lecture.roster} />
                </View>

                <View style={styles.lectureFooter}>
                  <Text style={styles.lectureFooterText}>Open live attendance</Text>
                  <MaterialIcons color={tokens.colors.primary} name="arrow-forward" size={18} />
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenShell>
  );
}

function SummaryCard({
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

  return (
    <View style={[styles.summaryCard, tone === 'tertiary' && styles.summaryCardWarm]}>
      <MaterialIcons color={iconColor} name={icon} size={24} />
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function LectureMeta({
  icon,
  text,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.lectureMetaItem}>
      <MaterialIcons color={tokens.colors.onSurfaceVariant} name={icon} size={16} />
      <Text style={styles.lectureMetaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionBody: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    lineHeight: 22,
  },
  actionButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: 14,
  },
  actionButtonText: {
    color: tokens.colors.onPrimary,
    fontSize: tokens.typography.body,
    fontWeight: '800',
  },
  actionCard: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    gap: tokens.spacing.lg,
    padding: tokens.spacing.xl,
    ...tokens.shadows.card,
  },
  actionCardIcon: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: tokens.colors.primarySoft,
    borderRadius: tokens.radii.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  actionCopy: {
    gap: tokens.spacing.xs,
  },
  actionTitle: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.title,
    fontWeight: '800',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
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
    paddingBottom: 64,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.xl,
  },
  hero: {
    gap: tokens.spacing.sm,
  },
  heroBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: withAlpha(tokens.colors.tertiary, 0.12),
    borderRadius: tokens.radii.pill,
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroBadgeDot: {
    backgroundColor: tokens.colors.tertiary,
    borderRadius: tokens.radii.pill,
    height: 8,
    width: 8,
  },
  heroBadgeText: {
    color: tokens.colors.onPrimaryFixed,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  heroSubtitle: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.bodyLg,
    lineHeight: 25,
    maxWidth: '92%',
  },
  heroTitle: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.display,
    fontWeight: '900',
    letterSpacing: -1.4,
    lineHeight: 42,
  },
  lectureCard: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    gap: tokens.spacing.lg,
    padding: tokens.spacing.xl,
    ...tokens.shadows.card,
  },
  lectureCodeChip: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: tokens.colors.primaryFixed,
    borderRadius: tokens.radii.pill,
    marginBottom: tokens.spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lectureCodeText: {
    color: tokens.colors.onPrimaryFixed,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  lectureFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lectureFooterText: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.body,
    fontWeight: '800',
  },
  lectureHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lectureList: {
    gap: tokens.spacing.lg,
  },
  lectureMetaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  lectureMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },
  lectureMetaText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '500',
  },
  lectureTitle: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.title,
    fontWeight: '800',
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
  statusBadge: {
    borderRadius: tokens.radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusBadgeLive: {
    backgroundColor: withAlpha(tokens.colors.success, 0.12),
  },
  statusBadgeSoon: {
    backgroundColor: withAlpha(tokens.colors.secondary, 0.1),
  },
  statusBadgeText: {
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statusBadgeTextLive: {
    color: tokens.colors.success,
  },
  statusBadgeTextSoon: {
    color: tokens.colors.secondary,
  },
  summaryCard: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    flex: 1,
    gap: tokens.spacing.sm,
    minHeight: 132,
    padding: tokens.spacing.lg,
    ...tokens.shadows.soft,
  },
  summaryCardWarm: {
    backgroundColor: withAlpha(tokens.colors.tertiary, 0.08),
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  summaryLabel: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '700',
  },
  summaryValue: {
    color: tokens.colors.onSurface,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
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
  topBarBrand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  topBarLabel: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  topBarTitle: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.title,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});
