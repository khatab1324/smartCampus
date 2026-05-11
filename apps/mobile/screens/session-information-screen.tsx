import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { ScreenShell } from '@/components/screen-shell';
import { getSessionByCode } from '@/constants/session-catalog';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import {
  getLectureDiscoveryMode,
  InstructorLecture,
  joinLiveLectureWithPin,
  subscribeLecture,
} from '@/services/lecture-session.service';
import { recordStudentSessionEntry } from '@/services/student-session-history.service';
import { getDisplayNameFromEmail } from '@/utils/user';

export default function SessionInformationScreen() {
  const { colors: themeColors } = useAppTheme();
  const params = useLocalSearchParams<{ lectureId?: string; sessionCode?: string }>();
  const { authUser, profile } = useAuth();
  const [liveLecture, setLiveLecture] = useState<InstructorLecture | null>(null);
  const [lectureLoaded, setLectureLoaded] = useState(false);
  const [sessionPin, setSessionPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const studentId = authUser?.uid ?? authUser?.email ?? 'local-student';
  const studentName =
    authUser?.displayName?.trim() ||
    (authUser?.email ? getDisplayNameFromEmail(authUser.email) : 'Student');
  const studentEmail = profile?.email ?? authUser?.email ?? null;
  const catalogSession = getSessionByCode(params.sessionCode);
  const session = useMemo(() => {
    if (!liveLecture) {
      return catalogSession;
    }

    const lecturer = liveLecture.instructorEmail
      ? getDisplayNameFromEmail(liveLecture.instructorEmail)
      : 'Instructor';
    const isLive = liveLecture.status === 'live';
    const isScheduled = liveLecture.status === 'scheduled';
    const discoveryMode = getLectureDiscoveryMode(liveLecture);

    return {
      ...catalogSession,
      activeAttendance: liveLecture.attendanceCount,
      code: liveLecture.code,
      crn: liveLecture.code,
      cta: 'Join' as const,
      department: 'Instructor live session',
      hint: isLive
        ? 'Attendance session is currently open'
        : isScheduled
          ? 'Attendance is not open yet'
          : 'Attendance session has ended',
      lecturer,
      locationDetail:
        discoveryMode === 'both'
          ? `Found by nearby scan or search key ${liveLecture.discoveryKey ?? liveLecture.code}`
          : discoveryMode === 'search-key'
          ? `Found by search key ${liveLecture.discoveryKey ?? liveLecture.code}`
          : 'Found by nearby classroom scan',
      locationLabel:
        discoveryMode === 'both'
          ? 'Nearby and key session'
          : discoveryMode === 'search-key'
            ? 'Search key session'
            : 'Nearby live session',
      remainingMinutes: liveLecture.durationMinutes,
      room: isLive ? 'Live' : isScheduled ? 'Scheduled' : 'Ended',
      status: isLive ? 'Live Now' : isScheduled ? 'Scheduled' : 'Ended',
      time: `${liveLecture.startTime} - ${liveLecture.endTime}`,
      title: liveLecture.title,
    };
  }, [catalogSession, liveLecture]);
  const lecturerInitials = session.lecturer
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  const sessionIsScheduled = liveLecture?.status === 'scheduled';
  const sessionIsEnded = liveLecture?.status === 'ended';
  const sessionBadgeLabel = sessionIsScheduled
    ? 'Scheduled'
    : sessionIsEnded
      ? 'Ended'
      : 'Live Session';

  useEffect(() => {
    if (!params.lectureId) {
      setLectureLoaded(true);
      return;
    }

    setLectureLoaded(false);
    const unsubscribe = subscribeLecture(
      params.lectureId,
      (lecture) => {
        setLiveLecture(lecture);
        setLectureLoaded(true);
      },
      () => {
        setLiveLecture(null);
        setLectureLoaded(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [params.lectureId]);

  const studentHasEntered = Boolean(
    liveLecture?.attendanceEvents.some((event) => event.id === studentId)
  );
  const requiresPin = Boolean(
    params.lectureId &&
      liveLecture?.status === 'live' &&
      profile?.role !== 'instructor' &&
      !studentHasEntered
  );

  async function handleJoinSession() {
    if (!liveLecture || isJoining) {
      return;
    }

    if (!/^\d{4}$/.test(sessionPin)) {
      setPinError('Enter the 4 digit session PIN.');
      return;
    }

    setIsJoining(true);
    setPinError('');

    try {
      const joinedLecture = await joinLiveLectureWithPin(liveLecture.id, {
        pin: sessionPin,
        studentEmail,
        studentId,
        studentName,
      });

      await recordStudentSessionEntry(studentId, joinedLecture);
      setLiveLecture(joinedLecture);
      setSessionPin('');
    } catch (error) {
      setPinError(error instanceof Error ? error.message : 'Could not enter this session.');
    } finally {
      setIsJoining(false);
    }
  }

  if (params.lectureId && !lectureLoaded) {
    return (
      <ScreenShell>
        <View className="flex-1">
          <SessionTopBar onBack={() => router.back()} />

          <View className="flex-1 items-center justify-center gap-md p-xl">
            <MaterialIcons color={themeColors.primary} name="sync" size={42} />
            <Text className="text-title font-extrabold text-onSurface">Loading live session</Text>
          </View>
        </View>
      </ScreenShell>
    );
  }

  if (params.lectureId && lectureLoaded && !liveLecture) {
    return (
      <ScreenShell>
        <View className="flex-1">
          <SessionTopBar onBack={() => router.back()} />

          <View className="flex-1 items-center justify-center gap-md p-xl">
            <MaterialIcons color={themeColors.outlineVariant} name="event-busy" size={42} />
            <Text className="text-title font-extrabold text-onSurface">Session not available</Text>
          </View>
        </View>
      </ScreenShell>
    );
  }

  if (requiresPin && liveLecture) {
    return (
      <PinGate
        error={pinError}
        isJoining={isJoining}
        lecture={liveLecture}
        onBack={() => router.back()}
        onChangePin={(value) => {
          setSessionPin(value.replace(/\D/g, '').slice(0, 4));
          setPinError('');
        }}
        onJoin={handleJoinSession}
        pin={sessionPin}
      />
    );
  }

  return (
    <ScreenShell>
      <View className="flex-1">
        <SessionTopBar avatarText="AH" onBack={() => router.back()} />

        <ScrollView
          contentContainerClassName="px-xl pb-[56px] pt-xl"
          showsVerticalScrollIndicator={false}>
          <View className="mb-xxxl">
            <View className="mb-sm flex-row items-start justify-between">
              <View
                className={[
                  'flex-row items-center gap-xs rounded-pill px-md py-[6px]',
                  sessionIsScheduled
                    ? 'bg-primaryFixed'
                    : sessionIsEnded
                      ? 'bg-surfaceHigh'
                      : 'bg-tertiary/10',
                ].join(' ')}>
                <View
                  className={[
                    'h-2 w-2 rounded-pill',
                    sessionIsScheduled
                      ? 'bg-primary'
                      : sessionIsEnded
                        ? 'bg-onSurfaceVariant'
                        : 'bg-tertiary',
                  ].join(' ')}
                />
                <Text
                  className={[
                    'text-micro font-extrabold uppercase tracking-[1px]',
                    sessionIsEnded ? 'text-onSurfaceVariant' : 'text-onPrimaryFixed',
                  ].join(' ')}>
                  {sessionBadgeLabel}
                </Text>
              </View>

              <Text className="text-body font-medium text-onSurfaceVariant">
                CRN: {session.crn}
              </Text>
            </View>

            <Text className="mb-md text-display font-black leading-[48px] text-onSurface">
              {session.title}
            </Text>
          </View>

          <View className="mb-xxxl flex-row gap-lg">
            <View className="flex-1 rounded-xl border border-primary/10 bg-primary/5 p-[20px]">
              <View className="mb-sm flex-row items-center gap-sm">
                <MaterialIcons color={themeColors.primary} name="timer" size={22} />
                <Text className="text-micro font-extrabold uppercase tracking-[1px] text-primary">
                  Time Remaining
                </Text>
              </View>
              <Text className="text-[32px] font-black text-onSurface">
                {session.remainingMinutes}
                <Text className="text-body font-bold text-onSurfaceVariant"> min</Text>
              </Text>
            </View>

            <View className="flex-1 rounded-xl border border-secondary/10 bg-secondary/5 p-[20px]">
              <View className="mb-sm flex-row items-center gap-sm">
                <MaterialIcons color={themeColors.secondary} name="group" size={22} />
                <Text className="text-micro font-extrabold uppercase tracking-[1px] text-secondary">
                  Attendance
                </Text>
              </View>
              <Text className="text-[32px] font-black text-onSurface">
                {session.activeAttendance}
                <Text className="text-body font-bold text-onSurfaceVariant"> active</Text>
              </Text>
            </View>
          </View>

          <View className="mb-xl gap-lg">
            <View className="flex-row items-center gap-lg rounded-xl bg-surfaceLowest p-xl">
              <View className="h-14 w-14 items-center justify-center rounded-pill bg-surfaceHigh">
                <Text className="text-bodyLg font-extrabold tracking-[0.8px] text-primary">
                  {lecturerInitials}
                </Text>
              </View>

              <View>
                <Text className="mb-[3px] text-micro font-extrabold uppercase tracking-[1px] text-tertiary">
                  Instructor
                </Text>
                <Text className="text-title font-extrabold leading-[22px] text-onSurface">
                  {session.lecturer}
                </Text>
                <Text className="mt-[2px] text-body text-onSurfaceVariant">
                  {session.department}
                </Text>
              </View>
            </View>

            <View className="gap-lg rounded-xl bg-surfaceLow p-xl">
              <InfoRow
                icon="location-on"
                label="Location"
                title={session.locationLabel}
              />

              <InfoRow
                icon="schedule"
                label="Session Hours"
                title={session.time}
              />
            </View>
          </View>

        </ScrollView>
      </View>
    </ScreenShell>
  );
}

function InfoRow({
  icon,
  label,
  title,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  title: string;
}) {
  const { colors: themeColors } = useAppTheme();

  return (
    <View className="flex-row gap-md">
      <View className="h-10 w-10 items-center justify-center rounded-[12px] bg-surfaceHigh">
        <MaterialIcons color={themeColors.primary} name={icon} size={22} />
      </View>

      <View className="flex-1">
        <Text className="mb-[3px] text-micro font-extrabold uppercase tracking-[1px] text-onSurfaceVariant">
          {label}
        </Text>
        <Text className="text-bodyLg font-bold text-onSurface">{title}</Text>
      </View>
    </View>
  );
}

function SessionTopBar({
  avatarText,
  onBack,
}: {
  avatarText?: string;
  onBack: () => void;
}) {
  const { colors: themeColors } = useAppTheme();

  return (
    <View className="flex-row items-center justify-between border-b border-outlineVariant/35 bg-surfaceLowest/90 px-xl pb-md pt-lg">
      <View className="flex-row items-center gap-md">
        <Pressable
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-pill active:scale-[0.99] active:opacity-85">
          <MaterialIcons color={themeColors.primary} name="arrow-back" size={22} />
        </Pressable>

        <Text className="text-title font-extrabold text-primary">Smart Attendance</Text>
      </View>

      {avatarText ? (
        <View className="h-10 w-10 items-center justify-center rounded-pill border-2 border-surfaceLowest bg-surfaceHigh">
          <Text className="text-label font-extrabold tracking-[0.6px] text-primary">
            {avatarText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function PinGate({
  error,
  isJoining,
  lecture,
  onBack,
  onChangePin,
  onJoin,
  pin,
}: {
  error: string;
  isJoining: boolean;
  lecture: InstructorLecture;
  onBack: () => void;
  onChangePin: (value: string) => void;
  onJoin: () => void;
  pin: string;
}) {
  const { colors: themeColors } = useAppTheme();

  return (
    <ScreenShell>
      <View className="flex-1">
        <SessionTopBar onBack={onBack} />

        <ScrollView
          contentContainerClassName="gap-xl px-xl pb-[56px] pt-xl"
          showsVerticalScrollIndicator={false}>
          <View className="gap-sm">
            <View className="flex-row items-center gap-xs self-start rounded-pill bg-tertiary/10 px-md py-[6px]">
              <View className="h-2 w-2 rounded-pill bg-tertiary" />
              <Text className="text-micro font-extrabold uppercase tracking-[1px] text-tertiary">
                PIN Required
              </Text>
            </View>

            <Text className="mb-md text-display font-black leading-[48px] text-onSurface">
              {lecture.title}
            </Text>
          </View>

          <View className="gap-lg rounded-xl bg-surfaceLowest p-xl">
            <AppTextField
              keyboardType="number-pad"
              label="Session PIN"
              onChangeText={onChangePin}
              placeholder="4 digit PIN"
              rightAdornment={<MaterialIcons color={themeColors.outline} name="pin" size={20} />}
              value={pin}
            />

            <View className="flex-row items-center gap-xs">
              <MaterialIcons color={themeColors.onSurfaceVariant} name="schedule" size={16} />
              <Text className="text-body font-bold text-onSurfaceVariant">
                {lecture.startTime} - {lecture.endTime}
              </Text>
            </View>

            {error ? (
              <View className="flex-row items-center gap-sm rounded-md bg-error/10 px-md py-md">
                <MaterialIcons color={themeColors.error} name="error-outline" size={18} />
                <Text className="flex-1 text-body font-bold text-error">{error}</Text>
              </View>
            ) : null}

            <AppButton
              disabled={pin.length !== 4 || isJoining}
              label={isJoining ? 'Entering...' : 'Enter Live Session'}
              onPress={onJoin}
              trailing={<MaterialIcons color={themeColors.onPrimary} name="login" size={20} />}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenShell>
  );
}
