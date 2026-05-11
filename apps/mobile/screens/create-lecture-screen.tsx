import { useMemo, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { ScreenShell } from '@/components/screen-shell';
import { weekDays } from '@/constants/week-days';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import {
  createInstructorLecture,
  getCurrentClockTime,
  getDurationLabel,
  getLectureEndTime,
  LectureDiscoveryMode,
  LectureDurationMinutes,
  LectureLaunchMode,
  normalizeDiscoveryKey,
} from '@/services/lecture-session.service';
import { getCurrentDeviceLocation } from '@/services/device-location.service';
import { openLiveAttendanceScreen } from '@/services/instructor-navigation.service';

const durationOptions: LectureDurationMinutes[] = [60, 90];

export default function CreateLectureScreen() {
  const { colors: themeColors } = useAppTheme();
  const { authUser } = useAuth();
  const [lectureName, setLectureName] = useState('');
  const [launchMode, setLaunchMode] = useState<LectureLaunchMode>('now');
  const [discoveryMode, setDiscoveryMode] = useState<LectureDiscoveryMode>('nearby');
  const [discoveryKey, setDiscoveryKey] = useState('');
  const [startTime, setStartTime] = useState('');
  const [sessionPin, setSessionPin] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<LectureDurationMinutes>(60);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Sun', 'Tue', 'Thu']);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const recurringLabel = useMemo(() => {
    if (!selectedDays.length) {
      return 'No recurring days selected';
    }

    return selectedDays.join(' • ');
  }, [selectedDays]);

  const endTime = useMemo(() => {
    if (launchMode === 'now') {
      return getLectureEndTime(getCurrentClockTime(), durationMinutes);
    }

    return getLectureEndTime(startTime, durationMinutes);
  }, [durationMinutes, launchMode, startTime]);
  const hasValidStartTime = launchMode === 'now' || Boolean(endTime);
  const normalizedDiscoveryKey = normalizeDiscoveryKey(discoveryKey);
  const hasValidDiscovery =
    discoveryMode === 'nearby' || normalizedDiscoveryKey.trim().length >= 3;
  const canStartLecture =
    lectureName.trim().length > 0 &&
    /^\d{4}$/.test(sessionPin.trim()) &&
    hasValidDiscovery &&
    hasValidStartTime &&
    !isSaving;

  function toggleDay(day: string) {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
    );
  }

  async function handleCreateLecture() {
    if (!canStartLecture) {
      return;
    }

    setIsSaving(true);

    try {
      const location =
        discoveryMode !== 'search-key' ? await getCurrentDeviceLocation() : null;

      if (discoveryMode !== 'search-key' && !location) {
        Alert.alert(
          'Location unavailable',
          'Allow location access or choose Search Key only so students can find this session.'
        );
        setIsSaving(false);
        return;
      }

      const lecture = await createInstructorLecture({
        days: selectedDays,
        discoveryKey: normalizedDiscoveryKey,
        discoveryMode,
        durationMinutes,
        instructorEmail: authUser?.email ?? null,
        instructorId: authUser?.uid ?? authUser?.email ?? 'local-instructor',
        launchMode,
        location,
        sessionPin: sessionPin.trim(),
        startTime: launchMode === 'scheduled' ? startTime.trim() : undefined,
        title: lectureName.trim(),
      });

      openLiveAttendanceScreen({ lectureId: lecture.id, mode: 'replace' });
    } catch (error) {
      Alert.alert(
        'Could not create lecture',
        error instanceof Error ? error.message : 'Check your Firebase connection and permissions.'
      );
      setIsSaving(false);
    }
  }

  return (
    <ScreenShell>
      <View className="flex-1">
        <View className="flex-row items-center justify-between border-b border-outlineVariant/35 bg-surfaceLowest/90 px-xl pb-md pt-lg">
          <View className="flex-row items-center gap-md">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-pill active:scale-[0.985] active:opacity-90">
              <MaterialIcons color={themeColors.primary} name="arrow-back" size={22} />
            </Pressable>

            <Text className="text-title font-extrabold text-primary">Create Lecture</Text>
          </View>
        </View>

        <ScrollView
          contentContainerClassName="gap-xl px-xl pb-[56px] pt-xl"
          showsVerticalScrollIndicator={false}>
          <View className="gap-sm">
            <Text className="text-display font-black leading-[42px] text-onSurface">
              Prepare your next classroom session
            </Text>
          </View>

          <View className="gap-lg rounded-xl bg-surfaceLowest p-xl">
            <AppTextField
              label="Lecture Name"
              onChangeText={setLectureName}
              placeholder="Distributed Systems"
              rightAdornment={
                <MaterialIcons color={themeColors.outline} name="menu-book" size={20} />
              }
              value={lectureName}
            />

            <View className="gap-sm">
              <Text className="ml-xs text-label font-extrabold uppercase tracking-[0.8px] text-onSurfaceVariant">
                Session Type
              </Text>
              <View className="gap-md">
                <LaunchModeOption
                  active={launchMode === 'now'}
                  icon="play-circle"
                  label="Start right now"
                  onPress={() => setLaunchMode('now')}
                />
                <LaunchModeOption
                  active={launchMode === 'scheduled'}
                  icon="event"
                  label="Scheduled lecture"
                  onPress={() => setLaunchMode('scheduled')}
                />
              </View>
            </View>

            <View className="gap-sm">
              <Text className="ml-xs text-label font-extrabold uppercase tracking-[0.8px] text-onSurfaceVariant">
                Student Discovery
              </Text>
              <View className="gap-md">
                <DiscoveryModeOption
                  active={discoveryMode === 'nearby'}
                  icon="location-on"
                  label="Nearby location"
                  onPress={() => setDiscoveryMode('nearby')}
                />
                <DiscoveryModeOption
                  active={discoveryMode === 'search-key'}
                  icon="key"
                  label="Search key"
                  onPress={() => setDiscoveryMode('search-key')}
                />
                <DiscoveryModeOption
                  active={discoveryMode === 'both'}
                  icon="travel-explore"
                  label="Nearby + key"
                  onPress={() => setDiscoveryMode('both')}
                />
              </View>
            </View>

            {discoveryMode !== 'nearby' ? (
              <AppTextField
                autoCapitalize="characters"
                label="Search Key"
                onChangeText={(value) => setDiscoveryKey(normalizeDiscoveryKey(value).slice(0, 12))}
                placeholder="CS101"
                rightAdornment={<MaterialIcons color={themeColors.outline} name="key" size={20} />}
                value={discoveryKey}
              />
            ) : null}

            {launchMode === 'scheduled' ? (
              <AppTextField
                label="Start Time"
                onChangeText={setStartTime}
                placeholder="09:00 AM"
                rightAdornment={
                  <MaterialIcons color={themeColors.outline} name="schedule" size={20} />
                }
                value={startTime}
              />
            ) : null}

            <AppTextField
              keyboardType="number-pad"
              label="Session PIN"
              onChangeText={(value) => setSessionPin(value.replace(/\D/g, '').slice(0, 4))}
              placeholder="4 digit PIN"
              rightAdornment={
                <MaterialIcons color={themeColors.outline} name="pin" size={20} />
              }
              value={sessionPin}
            />

            <View className="gap-sm">
              <Text className="ml-xs text-label font-extrabold uppercase tracking-[0.8px] text-onSurfaceVariant">
                Lecture Duration
              </Text>

              <View className="gap-md">
                {durationOptions.map((option) => {
                  const active = durationMinutes === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => setDurationMinutes(option)}
                      className={[
                        'min-h-[72px] flex-row items-center gap-sm rounded-xl border p-md active:scale-[0.985] active:opacity-90',
                        active
                          ? 'border-primary/25 bg-primarySoft'
                          : 'border-transparent bg-surfaceLow',
                      ].join(' ')}>
                      <MaterialIcons
                        color={active ? themeColors.primary : themeColors.outline}
                        name={active ? 'check-box' : 'check-box-outline-blank'}
                        size={22}
                      />

                      <View className="flex-1 gap-[2px]">
                        <Text className="text-bodyLg font-extrabold text-onSurface">
                          {getDurationLabel(option)}
                        </Text>
                        <Text className="text-body font-semibold text-onSurfaceVariant">
                          {launchMode === 'now'
                            ? `Ends around ${getLectureEndTime(getCurrentClockTime(), option)}`
                            : getLectureEndTime(startTime, option)
                              ? `Ends at ${getLectureEndTime(startTime, option)}`
                              : 'Enter a valid start time'}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pressable
              onPress={() => setModalVisible(true)}
              className="flex-row items-center justify-between rounded-xl bg-surfaceLow p-lg active:scale-[0.985] active:opacity-90">
              <View className="flex-1 flex-row items-center gap-md">
                <View className="h-11 w-11 items-center justify-center rounded-md bg-secondary/10">
                  <MaterialIcons color={themeColors.secondary} name="event-repeat" size={22} />
                </View>

                <View className="flex-1 gap-xs">
                  <Text className="text-label font-bold uppercase tracking-[1px] text-onSurfaceVariant">
                    Recurring Lecture
                  </Text>
                  <Text className="text-body font-bold text-onSurface">{recurringLabel}</Text>
                </View>
              </View>

              <MaterialIcons color={themeColors.primary} name="chevron-right" size={20} />
            </Pressable>

          </View>

          <AppButton
            disabled={!canStartLecture}
            label={
              isSaving
                ? 'Creating Lecture...'
                : launchMode === 'now'
                  ? 'Start Live Session'
                  : 'Schedule Lecture'
            }
            onPress={handleCreateLecture}
            trailing={
              <MaterialIcons color={themeColors.onPrimary} name="arrow-forward" size={20} />
            }
          />
        </ScrollView>

        <Modal animationType="slide" onRequestClose={() => setModalVisible(false)} transparent visible={modalVisible}>
          <View className="flex-1 justify-end">
            <Pressable
              onPress={() => setModalVisible(false)}
              className="absolute inset-0 bg-[rgba(8,12,25,0.38)]"
            />

            <View className="rounded-t-xl bg-surfaceLowest p-xl">
              <View className="mb-xl h-[5px] w-[54px] self-center rounded-pill bg-outlineVariant" />

              <Text className="mb-xs text-headline font-extrabold text-onSurface">
                Recurring Lecture
              </Text>

              <View className="mb-xl flex-row flex-wrap gap-md">
                {weekDays.map((day) => {
                  const active = selectedDays.includes(day);

                  return (
                    <Pressable
                      key={day}
                      onPress={() => toggleDay(day)}
                      className={[
                        'min-w-[78px] items-center rounded-pill px-lg py-[12px] active:scale-[0.985] active:opacity-90',
                        active ? 'bg-primary' : 'bg-surfaceLow',
                      ].join(' ')}>
                      <Text
                        className={[
                          'text-body font-bold',
                          active ? 'text-onPrimary' : 'text-onSurfaceVariant',
                        ].join(' ')}>
                        {day}
                      </Text>
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

function LaunchModeOption({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors: themeColors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      className={[
        'flex-row items-center gap-sm rounded-xl border p-md active:scale-[0.985] active:opacity-90',
        active ? 'border-primary/25 bg-primarySoft' : 'border-transparent bg-surfaceLow',
      ].join(' ')}>
      <MaterialIcons
        color={active ? themeColors.primary : themeColors.outline}
        name={icon}
        size={24}
      />

      <View className="flex-1 gap-[3px]">
        <Text className="text-body font-black text-onSurface">{label}</Text>
      </View>

      <MaterialIcons
        color={active ? themeColors.primary : themeColors.outlineVariant}
        name={active ? 'radio-button-checked' : 'radio-button-unchecked'}
        size={22}
      />
    </Pressable>
  );
}

function DiscoveryModeOption({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors: themeColors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      className={[
        'flex-row items-center gap-sm rounded-xl border p-md active:scale-[0.985] active:opacity-90',
        active ? 'border-primary/25 bg-primarySoft' : 'border-transparent bg-surfaceLow',
      ].join(' ')}>
      <MaterialIcons
        color={active ? themeColors.primary : themeColors.outline}
        name={icon}
        size={24}
      />

      <View className="flex-1 gap-[3px]">
        <Text className="text-body font-black text-onSurface">{label}</Text>
      </View>

      <MaterialIcons
        color={active ? themeColors.primary : themeColors.outlineVariant}
        name={active ? 'radio-button-checked' : 'radio-button-unchecked'}
        size={22}
      />
    </Pressable>
  );
}
