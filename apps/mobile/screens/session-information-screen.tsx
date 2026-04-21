import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { getSessionByCode } from '@/constants/session-catalog';
import { tokens } from '@/constants/tokens';

export default function SessionInformationScreen() {
  const params = useLocalSearchParams<{ sessionCode?: string }>();
  const session = getSessionByCode(params.sessionCode);
  const lecturerInitials = session.lecturer
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <ScreenShell>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}>
              <MaterialIcons color={tokens.colors.primary} name="arrow-back" size={22} />
            </Pressable>

            <Text style={styles.topBarTitle}>Smart Attendance</Text>
          </View>

          <View style={styles.avatarShell}>
            <Text style={styles.avatarText}>AH</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroTopRow}>
              <View style={styles.liveSessionBadge}>
                <View style={styles.liveSessionDot} />
                <Text style={styles.liveSessionText}>Live Session</Text>
              </View>

              <Text style={styles.crnText}>CRN: {session.crn}</Text>
            </View>

            <Text style={styles.title}>{session.title}</Text>
            <Text style={styles.description}>{session.description}</Text>
          </View>

          <View style={styles.statusGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <MaterialIcons color={tokens.colors.primary} name="timer" size={22} />
                <Text style={styles.metricLabel}>Time Remaining</Text>
              </View>
              <Text style={styles.metricValue}>
                {session.remainingMinutes}
                <Text style={styles.metricUnit}> min</Text>
              </Text>
            </View>

            <View style={styles.metricCardSecondary}>
              <View style={styles.metricHeader}>
                <MaterialIcons color={tokens.colors.secondary} name="group" size={22} />
                <Text style={styles.metricLabelSecondary}>Attendance</Text>
              </View>
              <Text style={styles.metricValue}>
                {session.activeAttendance}
                <Text style={styles.metricUnit}> active</Text>
              </Text>
            </View>
          </View>

          <View style={styles.infoStack}>
            <View style={styles.instructorCard}>
              <View style={styles.instructorAvatar}>
                <Text style={styles.instructorInitials}>{lecturerInitials}</Text>
              </View>

              <View>
                <Text style={styles.instructorLabel}>Instructor</Text>
                <Text style={styles.instructorName}>{session.lecturer}</Text>
                <Text style={styles.instructorDept}>{session.department}</Text>
              </View>
            </View>

            <View style={styles.locationCard}>
              <InfoRow
                icon="location-on"
                label="Location"
                title={session.locationLabel}
                subtitle={session.locationDetail}
              />

              <InfoRow
                icon="schedule"
                label="Session Hours"
                title={session.time}
              />
            </View>
          </View>

          <View style={styles.tokenFooter}>
            <MaterialIcons color={tokens.colors.onSurfaceVariant} name="verified-user" size={16} />
            <Text style={styles.tokenFooterText}>Actively transmitting attendance tokens</Text>
          </View>
        </ScrollView>
      </View>
    </ScreenShell>
  );
}

function InfoRow({
  icon,
  label,
  subtitle,
  title,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconShell}>
        <MaterialIcons color={tokens.colors.primary} name={icon} size={22} />
      </View>

      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoTitle}>{title}</Text>
        {subtitle ? <Text style={styles.infoSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>
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
  topBarLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  backButton: {
    alignItems: 'center',
    borderRadius: tokens.radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  topBarTitle: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.title,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  avatarShell: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceHigh,
    borderColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.pill,
    borderWidth: 2,
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
  content: {
    paddingBottom: 56,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.xl,
  },
  hero: {
    marginBottom: tokens.spacing.xxxl,
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.sm,
  },
  liveSessionBadge: {
    alignItems: 'center',
    backgroundColor: '#FFDBCC',
    borderRadius: tokens.radii.pill,
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveSessionDot: {
    backgroundColor: tokens.colors.tertiary,
    borderRadius: tokens.radii.pill,
    height: 8,
    width: 8,
  },
  liveSessionText: {
    color: tokens.colors.onPrimaryFixed,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  crnText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '500',
  },
  title: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.display,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 48,
    marginBottom: tokens.spacing.md,
  },
  description: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.bodyLg,
    lineHeight: 26,
    maxWidth: '92%',
  },
  statusGrid: {
    flexDirection: 'row',
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing.xxxl,
  },
  metricCard: {
    backgroundColor: 'rgba(0,88,188,0.05)',
    borderColor: 'rgba(0,88,188,0.1)',
    borderRadius: tokens.radii.xl,
    borderWidth: 1,
    flex: 1,
    padding: 20,
  },
  metricCardSecondary: {
    backgroundColor: 'rgba(64,94,150,0.05)',
    borderColor: 'rgba(64,94,150,0.1)',
    borderRadius: tokens.radii.xl,
    borderWidth: 1,
    flex: 1,
    padding: 20,
  },
  metricHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  metricLabel: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metricLabelSecondary: {
    color: tokens.colors.secondary,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: tokens.colors.onSurface,
    fontSize: 32,
    fontWeight: '900',
  },
  metricUnit: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '700',
  },
  infoStack: {
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
  },
  instructorCard: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    gap: tokens.spacing.lg,
    padding: tokens.spacing.xl,
    ...tokens.shadows.card,
  },
  instructorAvatar: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: tokens.radii.pill,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  instructorInitials: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.bodyLg,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  instructorLabel: {
    color: tokens.colors.tertiary,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  instructorName: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.title,
    fontWeight: '800',
    lineHeight: 22,
  },
  instructorDept: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    marginTop: 2,
  },
  locationCard: {
    backgroundColor: tokens.colors.surfaceLow,
    borderRadius: tokens.radii.xl,
    gap: tokens.spacing.lg,
    padding: tokens.spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  infoIconShell: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  infoCopy: {
    flex: 1,
  },
  infoLabel: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  infoTitle: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.bodyLg,
    fontWeight: '700',
  },
  infoSubtitle: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    marginTop: 2,
  },
  tokenFooter: {
    alignItems: 'center',
    borderTopColor: 'rgba(193,198,215,0.3)',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    justifyContent: 'center',
    paddingTop: tokens.spacing.lg,
  },
  tokenFooterText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});
