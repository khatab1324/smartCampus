import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { tokens } from '@/constants/tokens';
import { openAvailableSessionsScreen, openHistoryScreen } from '@/services/session-navigation.service';

export default function StudentHomeScreen() {
  return (
    <ScreenShell>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.topBarBrand}>
            <View style={styles.avatarShell}>
              <Text style={styles.avatarText}>AH</Text>
            </View>
            <Text style={styles.topBarTitle}>Smart Campus</Text>
          </View>
          <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
            <MaterialIcons color={tokens.colors.outline} name="notifications-none" size={22} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.title}>Welcome Afnan</Text>

          </View>

          <View style={styles.scanCard}>
            <View style={styles.scanCardHeader}>
              <View style={styles.scanReadyBadge}>
                <MaterialIcons color={tokens.colors.onPrimaryFixed} name="sensors" size={14} />
                <Text style={styles.scanReadyText}>Ready to Scan</Text>
              </View>
              <View style={styles.proximityBlock}>
                <Text style={styles.proximityLabel}>Proximity</Text>
                <Text style={styles.proximityValue}>Nearby Search</Text>
              </View>
            </View>

            <View style={styles.scanIntro}>
              <View style={styles.scanIconWrap}>
                <View style={styles.scanPulse} />
                <View style={styles.scanIconCore}>
                  <MaterialIcons color={tokens.colors.onPrimary} name="location-searching" size={30} />
                </View>
              </View>
              <Text style={styles.scanTitle}>Lecture Check-In</Text>
              <Text style={styles.scanDescription}>
                Step inside your lecture hall and scan to record your attendance automatically.
              </Text>
            </View>

            <Pressable
              onPress={openAvailableSessionsScreen}
              style={({ pressed }) => [styles.scanButton, pressed && styles.buttonPressed]}>
              <MaterialIcons color={tokens.colors.onPrimary} name="radar" size={20} />
              <Text style={styles.scanButtonText}>Scan for Nearby Sessions</Text>
            </Pressable>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.attendanceCard]}>
              <View>
                <MaterialIcons
                  color={tokens.colors.primary}
                  name="analytics"
                  size={24}
                  style={styles.statIcon}
                />
                <Text style={styles.statLabel}>Total Attendance %</Text>
              </View>
              <View>
                <Text style={styles.statValue}>92%</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressValue, styles.progressValueWide]} />
                </View>
              </View>
            </View>

            <View style={[styles.statCard, styles.statusCard]}>
              <View>
                <MaterialIcons
                  color={tokens.colors.onPrimaryFixed}
                  name="verified-user"
                  size={24}
                  style={styles.statIcon}
                />
                <Text style={styles.statusLabel}>Status</Text>
              </View>
              <View>
                <Text style={styles.statusValue}>On Track</Text>
                <Text style={styles.statusMeta}>Good standing</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Status</Text>
            <Pressable onPress={openHistoryScreen}>
              <Text style={styles.sectionLink}>View History</Text>
            </Pressable>
          </View>

          <View style={styles.statusList}>
            <StatusRow subject="Operating Systems" time="Yesterday, 10:00 AM" tone="success" />
            <StatusRow subject="Database Systems" time="Mon, 2:30 PM" tone="success" />
            <StatusRow dimmed subject="Linear Algebra" time="Mon, 8:00 AM" tone="error" />
          </View>
        </ScrollView>
      </View>
    </ScreenShell>
  );
}

function StatusRow({
  dimmed,
  subject,
  time,
  tone,
}: {
  dimmed?: boolean;
  subject: string;
  time: string;
  tone: 'success' | 'error';
}) {
  const iconName = tone === 'success' ? 'check-circle' : 'cancel';
  const iconColor = tone === 'success' ? tokens.colors.success : tokens.colors.error;
  const iconBackground = tone === 'success' ? tokens.colors.successSoft : tokens.colors.dangerSoft;

  return (
    <View style={[styles.statusRow, dimmed && styles.statusRowDimmed]}>
      <View style={styles.statusRowMain}>
        <View style={[styles.statusIconShell, { backgroundColor: iconBackground }]}>
          <MaterialIcons color={iconColor} name={iconName} size={22} />
        </View>
        <View>
          <Text style={styles.statusSubject}>{subject}</Text>
          <Text style={styles.statusTime}>{time}</Text>
        </View>
      </View>
      <Text style={[styles.statusMetaBadge, { color: iconColor }]}>Session Time</Text>
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
  topBarBrand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  avatarShell: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primaryFixed,
    borderColor: tokens.colors.primaryFixed,
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
    gap: tokens.spacing.xl,
    paddingBottom: 140,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.xl,
  },
  hero: {
    gap: tokens.spacing.xs,
  },
  title: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.display,
    fontWeight: '800',
    letterSpacing: -1.4,
    lineHeight: 40,
  },
  subtitle: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '500',
  },
  scanCard: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    padding: tokens.spacing.xl,
    ...tokens.shadows.card,
  },
  scanCardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.xl,
  },
  scanReadyBadge: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primaryFixed,
    borderRadius: tokens.radii.pill,
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scanReadyText: {
    color: tokens.colors.onPrimaryFixed,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  proximityBlock: {
    alignItems: 'flex-end',
  },
  proximityLabel: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '500',
    letterSpacing: 0.8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  proximityValue: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.body,
    fontWeight: '800',
  },
  scanIntro: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xxl,
  },
  scanIconWrap: {
    alignItems: 'center',
    height: 72,
    justifyContent: 'center',
    marginBottom: tokens.spacing.md,
    width: 72,
  },
  scanPulse: {
    backgroundColor: 'rgba(0, 88, 188, 0.1)',
    borderRadius: tokens.radii.pill,
    height: 72,
    position: 'absolute',
    width: 72,
  },
  scanIconCore: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primaryContainer,
    borderRadius: tokens.radii.pill,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  scanTitle: {
    color: tokens.colors.onSurface,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: tokens.spacing.sm,
  },
  scanDescription: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    lineHeight: 20,
    maxWidth: 240,
    textAlign: 'center',
  },
  scanButton: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    gap: tokens.spacing.md,
    justifyContent: 'center',
    minHeight: 56,
    ...tokens.shadows.floating,
  },
  scanButtonText: {
    color: tokens.colors.onPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: tokens.spacing.lg,
  },
  statCard: {
    aspectRatio: 1,
    borderRadius: tokens.radii.xl,
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  attendanceCard: {
    backgroundColor: tokens.colors.surfaceLow,
  },
  statusCard: {
    backgroundColor: tokens.colors.primaryFixed,
  },
  statIcon: {
    marginBottom: 12,
  },
  statLabel: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statValue: {
    color: tokens.colors.onSurface,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  statusLabel: {
    color: tokens.colors.onPrimaryFixed,
    fontSize: tokens.typography.label,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statusValue: {
    color: tokens.colors.onPrimaryFixed,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  statusMeta: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '500',
    marginTop: tokens.spacing.xs,
  },
  progressTrack: {
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: tokens.radii.pill,
    height: 6,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressValue: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.pill,
    height: '100%',
  },
  progressValueWide: {
    width: '92%',
  },
  sectionHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: tokens.colors.onSurface,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionLink: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.body,
    fontWeight: '800',
  },
  statusList: {
    gap: 12,
  },
  statusRow: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: tokens.spacing.lg,
    ...tokens.shadows.soft,
  },
  statusRowDimmed: {
    opacity: 0.6,
  },
  statusRowMain: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.lg,
  },
  statusIconShell: {
    alignItems: 'center',
    borderRadius: tokens.radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  statusSubject: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.bodyLg,
    fontWeight: '800',
  },
  statusTime: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    marginTop: tokens.spacing.xs,
  },
  statusMetaBadge: {
    fontSize: tokens.typography.label,
    fontWeight: '800',
    letterSpacing: -0.1,
    textTransform: 'uppercase',
  },
});
