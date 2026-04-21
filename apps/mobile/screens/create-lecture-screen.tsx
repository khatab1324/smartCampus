import { useMemo, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { ScreenShell } from '@/components/screen-shell';
import { weekDays } from '@/constants/instructor-mocks';
import { tokens } from '@/constants/tokens';
import { openLiveAttendanceScreen } from '@/services/instructor-navigation.service';
import { withAlpha } from '@/utils/color';

export default function CreateLectureScreen() {
  const [lectureName, setLectureName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Sun', 'Tue', 'Thu']);
  const [modalVisible, setModalVisible] = useState(false);

  const recurringLabel = useMemo(() => {
    if (!selectedDays.length) {
      return 'No recurring days selected';
    }

    return selectedDays.join(' • ');
  }, [selectedDays]);

  const canStartLecture = lectureName.trim().length > 0 && startTime.trim().length > 0;

  function toggleDay(day: string) {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
    );
  }

  function handleCreateLecture() {
    if (!canStartLecture) {
      return;
    }

    openLiveAttendanceScreen({
      days: selectedDays,
      lectureName: lectureName.trim(),
      startTime: startTime.trim(),
    });
  }

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

            <Text style={styles.topBarTitle}>Create Lecture</Text>
          </View>

          <View style={styles.topBarBadge}>
            <Text style={styles.topBarBadgeText}>Step 1</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <MaterialIcons color={tokens.colors.tertiary} name="auto-awesome" size={16} />
              <Text style={styles.heroBadgeText}>Beautiful Create Lecture</Text>
            </View>

            <Text style={styles.heroTitle}>Prepare your next classroom session</Text>
            <Text style={styles.heroSubtitle}>
              Name the lecture, choose when it starts, and lock in the weekly recurrence before opening live attendance.
            </Text>
          </View>

          <View style={styles.formCard}>
            <AppTextField
              label="Lecture Name"
              onChangeText={setLectureName}
              placeholder="Distributed Systems"
              rightAdornment={
                <MaterialIcons color={tokens.colors.outline} name="menu-book" size={20} />
              }
              value={lectureName}
            />

            <AppTextField
              label="Start Time"
              onChangeText={setStartTime}
              placeholder="09:00 AM"
              rightAdornment={
                <MaterialIcons color={tokens.colors.outline} name="schedule" size={20} />
              }
              value={startTime}
            />

            <Pressable
              onPress={() => setModalVisible(true)}
              style={({ pressed }) => [styles.recurringCard, pressed && styles.buttonPressed]}>
              <View style={styles.recurringCardMain}>
                <View style={styles.recurringIconShell}>
                  <MaterialIcons color={tokens.colors.secondary} name="event-repeat" size={22} />
                </View>

                <View style={styles.recurringCopy}>
                  <Text style={styles.recurringLabel}>Recurring Lecture</Text>
                  <Text style={styles.recurringValue}>{recurringLabel}</Text>
                </View>
              </View>

              <MaterialIcons color={tokens.colors.primary} name="chevron-right" size={20} />
            </Pressable>

            <View style={styles.infoStrip}>
              <MaterialIcons color={tokens.colors.secondary} name="info-outline" size={18} />
              <Text style={styles.infoStripText}>
                After saving, the instructor flow goes directly into the live attendance screen.
              </Text>
            </View>
          </View>

          <AppButton
            disabled={!canStartLecture}
            label="Create Lecture & Go Live"
            onPress={handleCreateLecture}
            trailing={
              <MaterialIcons color={tokens.colors.onPrimary} name="arrow-forward" size={20} />
            }
          />
        </ScrollView>

        <Modal animationType="slide" onRequestClose={() => setModalVisible(false)} transparent visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <Pressable onPress={() => setModalVisible(false)} style={styles.modalBackdrop} />

            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />

              <Text style={styles.modalTitle}>Recurring Lecture</Text>
              <Text style={styles.modalSubtitle}>Choose the days in the week for this lecture.</Text>

              <View style={styles.dayGrid}>
                {weekDays.map((day) => {
                  const active = selectedDays.includes(day);

                  return (
                    <Pressable
                      key={day}
                      onPress={() => toggleDay(day)}
                      style={({ pressed }) => [
                        styles.dayChip,
                        active && styles.dayChipActive,
                        pressed && styles.buttonPressed,
                      ]}>
                      <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>{day}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <AppButton label="Save Days" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
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
  dayChip: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceLow,
    borderRadius: tokens.radii.pill,
    minWidth: 78,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: 12,
  },
  dayChipActive: {
    backgroundColor: tokens.colors.primary,
  },
  dayChipText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '700',
  },
  dayChipTextActive: {
    color: tokens.colors.onPrimary,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.xl,
  },
  formCard: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.xl,
    gap: tokens.spacing.lg,
    padding: tokens.spacing.xl,
    ...tokens.shadows.card,
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
  heroBadgeText: {
    color: tokens.colors.onPrimaryFixed,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
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
  iconButton: {
    alignItems: 'center',
    borderRadius: tokens.radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  infoStrip: {
    alignItems: 'center',
    backgroundColor: withAlpha(tokens.colors.secondary, 0.08),
    borderRadius: tokens.radii.md,
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  infoStripText: {
    color: tokens.colors.onSurfaceVariant,
    flex: 1,
    fontSize: tokens.typography.body,
    lineHeight: 21,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 12, 25, 0.38)',
  },
  modalHandle: {
    alignSelf: 'center',
    backgroundColor: tokens.colors.outlineVariant,
    borderRadius: tokens.radii.pill,
    height: 5,
    marginBottom: tokens.spacing.xl,
    width: 54,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderTopLeftRadius: tokens.radii.xl,
    borderTopRightRadius: tokens.radii.xl,
    padding: tokens.spacing.xl,
  },
  modalSubtitle: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    lineHeight: 22,
    marginBottom: tokens.spacing.xl,
  },
  modalTitle: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.headline,
    fontWeight: '800',
    marginBottom: tokens.spacing.xs,
  },
  recurringCard: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceLow,
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: tokens.spacing.lg,
  },
  recurringCardMain: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  recurringCopy: {
    flex: 1,
    gap: 4,
  },
  recurringIconShell: {
    alignItems: 'center',
    backgroundColor: withAlpha(tokens.colors.secondary, 0.12),
    borderRadius: tokens.radii.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  recurringLabel: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  recurringValue: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.body,
    fontWeight: '700',
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
  topBarBadge: {
    backgroundColor: tokens.colors.primaryFixed,
    borderRadius: tokens.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  topBarBadgeText: {
    color: tokens.colors.onPrimaryFixed,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
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
