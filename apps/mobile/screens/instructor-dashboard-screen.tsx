import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { exportLectureAttendanceReport } from '@/services/attendance-report-export.service';
import { openCreateLectureScreen, openLiveAttendanceScreen } from '@/services/instructor-navigation.service';
import { InstructorLecture, subscribeInstructorLectures } from '@/services/lecture-session.service';
import { getDisplayNameFromEmail, getInitialsFromEmail } from '@/utils/user';

export default function InstructorDashboardScreen() {
  const { colors: themeColors } = useAppTheme();
  const { authUser } = useAuth();
  const [lectures, setLectures] = useState<InstructorLecture[]>([]);
  const [exportingLectureId, setExportingLectureId] = useState<string | null>(null);
  const email = authUser?.email ?? 'instructor@smartcampus.edu';
  const instructorId = authUser?.uid ?? authUser?.email ?? 'local-instructor';
  const displayName = getDisplayNameFromEmail(email);
  const initials = getInitialsFromEmail(email);
  const liveLectureCount = lectures.filter((lecture) => lecture.status === 'live').length;
  const reportCount = lectures.filter((lecture) => lecture.status === 'ended').length;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const unsubscribe = subscribeInstructorLectures(instructorId, (nextLectures) => {
        if (isActive) {
          setLectures(nextLectures);
        }
      });

      return () => {
        isActive = false;
        unsubscribe();
      };
    }, [instructorId])
  );

  async function handleExportLecture(lecture: InstructorLecture) {
    if (exportingLectureId) {
      return;
    }

    setExportingLectureId(lecture.id);

    try {
      await exportLectureAttendanceReport(lecture);
    } catch (downloadError) {
      const message =
        downloadError instanceof Error
          ? downloadError.message
          : 'Could not download this attendance report.';

      Alert.alert(
        message.startsWith('Report downloaded') ? 'Open failed' : 'Download failed',
        message
      );
    } finally {
      setExportingLectureId(null);
    }
  }

  return (
    <ScreenShell>
      <View className="flex-1">
        <View className="flex-row items-center justify-between border-b border-outlineVariant/35 bg-surfaceLowest/90 px-xl pb-md pt-lg">
          <View className="flex-row items-center gap-md">
            <View className="h-10 w-10 items-center justify-center rounded-pill bg-primaryFixed">
              <Text className="text-label font-extrabold tracking-[0.6px] text-primary">
                {initials || 'IN'}
              </Text>
            </View>
            <View>
              <Text className="text-label font-bold uppercase tracking-[1px] text-onSurfaceVariant">
                Instructor Console
              </Text>
              <Text className="text-title font-extrabold text-primary">Smart Campus</Text>
            </View>
          </View>

          <Pressable
            onPress={openCreateLectureScreen}
            className="h-11 w-11 items-center justify-center rounded-pill bg-primary active:scale-[0.985] active:opacity-90">
            <MaterialIcons color={themeColors.onPrimary} name="add" size={22} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerClassName="gap-xl px-xl pb-[64px] pt-xl"
          showsVerticalScrollIndicator={false}>
          <View className="gap-sm">
            <Text className="text-display font-black leading-[42px] text-onSurface">
              Welcome back, {displayName}
            </Text>
          </View>

          <View className="flex-row gap-md">
            <SummaryCard
              icon="school"
              label="Active Lectures"
              tone="primary"
              value={String(liveLectureCount)}
            />
            <SummaryCard
              icon="analytics"
              label="Reports"
              tone="tertiary"
              value={String(reportCount)}
            />
          </View>

          <View className="gap-lg rounded-xl bg-surfaceLowest p-xl">
            <View className="h-11 w-11 items-center justify-center self-start rounded-md bg-primarySoft">
              <MaterialIcons color={themeColors.primary} name="add-circle-outline" size={24} />
            </View>

            <View className="gap-xs">
              <Text className="text-title font-extrabold text-onSurface">Start a new lecture</Text>
            </View>

            <Pressable
              onPress={openCreateLectureScreen}
              className="flex-row items-center gap-sm self-start rounded-xl bg-primary px-lg py-[14px] active:scale-[0.985] active:opacity-90">
              <Text className="text-body font-extrabold text-onPrimary">Create Lecture</Text>
              <MaterialIcons color={themeColors.onPrimary} name="arrow-forward" size={18} />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-title font-extrabold text-onSurface">Created Lectures</Text>
            <Text className="text-label font-semibold text-onSurfaceVariant">
              {lectures.length} saved
            </Text>
          </View>

          {lectures.length > 0 ? (
            <View className="gap-md">
              {lectures.map((lecture) => {
                const isLive = lecture.status === 'live';
                const isScheduled = lecture.status === 'scheduled';
                const isEnded = lecture.status === 'ended';
                const statusLabel = isLive ? 'Live' : isScheduled ? 'Scheduled' : 'Ended';
                const timeLabel = isScheduled
                  ? `Opens ${lecture.startTime}`
                  : `${lecture.startTime} - ${lecture.endTime}`;
                const attendanceLabel = isLive
                  ? `${lecture.attendanceCount} active`
                  : `${lecture.attendanceCount} checked in`;
                const lectureCardClassName = [
                  'gap-lg rounded-xl border bg-surfaceLowest p-xl active:scale-[0.985] active:opacity-90',
                  isLive ? 'border-success/25' : 'border-outlineVariant/35',
                ].join(' ');
                const statusBadgeClassName = [
                  'rounded-pill px-md py-sm',
                  isLive ? 'bg-success/10' : isScheduled ? 'bg-primaryFixed' : 'bg-surfaceHigh',
                ].join(' ');
                const statusTextClassName = [
                  'text-micro font-extrabold uppercase tracking-[1px]',
                  isLive
                    ? 'text-success'
                    : isScheduled
                      ? 'text-onPrimaryFixed'
                      : 'text-onSurfaceVariant',
                ].join(' ');

                return (
                  <Pressable
                    key={lecture.id}
                    onPress={() => openLiveAttendanceScreen({ lectureId: lecture.id })}
                    className={lectureCardClassName}>
                    <View className="flex-row items-center justify-between gap-md">
                      <View className="flex-1 gap-[3px]">
                        <Text numberOfLines={1} className="text-title font-extrabold text-onSurface">
                          {lecture.title}
                        </Text>
                        <Text
                          numberOfLines={1}
                          className="text-body font-semibold text-onSurfaceVariant">
                          {timeLabel}
                        </Text>
                      </View>

                      <View className={statusBadgeClassName}>
                        <Text className={statusTextClassName}>
                          {statusLabel}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between gap-sm">
                      <View className="flex-row items-center gap-[6px] rounded-pill bg-surfaceHigh px-[14px] py-[10px]">
                        <MaterialIcons color={themeColors.onSurfaceVariant} name="groups" size={16} />
                        <Text className="text-label font-extrabold text-onSurfaceVariant">
                          {attendanceLabel}
                        </Text>
                      </View>

                      {isEnded ? (
                        <View className="flex-row items-center gap-sm">
                          <Pressable
                            disabled={Boolean(exportingLectureId)}
                            onPress={(event) => {
                              event.stopPropagation();
                              void handleExportLecture(lecture);
                            }}
                            className={[
                              'flex-row items-center gap-[6px] rounded-pill bg-primarySoft px-[14px] py-[10px] active:scale-[0.985] active:opacity-90',
                              Boolean(exportingLectureId) ? 'opacity-55' : '',
                            ].join(' ')}>
                            <MaterialIcons color={themeColors.primary} name="download" size={17} />
                            <Text className="text-label font-black text-primary">
                              {exportingLectureId === lecture.id ? 'Downloading' : 'Download'}
                            </Text>
                          </Pressable>
                        </View>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View className="items-center gap-md rounded-xl bg-surfaceLowest p-xl">
              <View className="h-[52px] w-[52px] items-center justify-center rounded-md bg-primarySoft">
                <MaterialIcons color={themeColors.primary} name="event-note" size={26} />
              </View>
              <Text className="text-title font-extrabold text-onSurface">
                No lectures created yet
              </Text>
              <Pressable
                onPress={openCreateLectureScreen}
                className="flex-row items-center gap-sm rounded-xl bg-primary px-lg py-[13px] active:scale-[0.985] active:opacity-90">
                <Text className="text-body font-extrabold text-onPrimary">Create Lecture</Text>
                <MaterialIcons color={themeColors.onPrimary} name="add" size={18} />
              </Pressable>
            </View>
          )}
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
  const { colors: themeColors } = useAppTheme();
  const iconColor =
    tone === 'primary'
      ? themeColors.primary
      : tone === 'secondary'
        ? themeColors.secondary
      : themeColors.tertiary;
  const cardClassName = [
    'min-h-[132px] flex-1 gap-sm rounded-xl p-lg',
    tone === 'tertiary' ? 'bg-tertiary/10' : 'bg-surfaceLowest',
  ].join(' ');

  return (
    <View className={cardClassName}>
      <MaterialIcons color={iconColor} name={icon} size={24} />
      <Text className="text-[28px] font-black text-onSurface">{value}</Text>
      <Text className="text-label font-bold text-onSurfaceVariant">{label}</Text>
    </View>
  );
}
