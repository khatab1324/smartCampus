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

export default function InstructorHistoryScreen() {
  const { colors: themeColors } = useAppTheme();
  const { authUser } = useAuth();
  const [lectures, setLectures] = useState<InstructorLecture[]>([]);
  const [exportingLectureId, setExportingLectureId] = useState<string | null>(null);
  const email = authUser?.email ?? 'instructor@smartcampus.edu';
  const instructorId = authUser?.uid ?? authUser?.email ?? 'local-instructor';
  const initials = getInitialsFromEmail(email);
  const displayName = getDisplayNameFromEmail(email);
  const endedCount = lectures.filter((lecture) => lecture.status === 'ended').length;
  const liveCount = lectures.filter((lecture) => lecture.status === 'live').length;

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
      const result = await exportLectureAttendanceReport(lecture);
      Alert.alert('Report exported', `${result.fileName} includes ${result.rowCount} students.`);
    } catch {
      Alert.alert('Export failed', 'Could not export this attendance report.');
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
              <Text className="text-label font-bold text-onSurfaceVariant">
                Instructor History
              </Text>
              <Text className="text-title font-extrabold text-primary">Smart Campus</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerClassName="gap-xl px-xl pb-[64px] pt-xl"
          showsVerticalScrollIndicator={false}>
          <View className="gap-sm">
            <Text className="text-display font-black leading-[42px] text-onSurface">
              {displayName}&apos;s lectures
            </Text>
          </View>

          <View className="flex-row gap-md">
            <StatCard icon="history-edu" label="Created" value={String(lectures.length)} />
            <StatCard icon="task-alt" label="Reports" value={String(endedCount)} />
            <StatCard icon="wifi-tethering" label="Live" value={String(liveCount)} />
          </View>

          {lectures.length > 0 ? (
            <View className="gap-lg">
              {lectures.map((lecture) => {
                const isEnded = lecture.status === 'ended';
                const isLive = lecture.status === 'live';
                const isScheduled = lecture.status === 'scheduled';
                const statusLabel = isEnded ? 'Ended' : isScheduled ? 'Scheduled' : 'Live';
                const timeLabel = isScheduled
                  ? `Opens ${lecture.startTime}`
                  : `${lecture.startTime} - ${lecture.endTime}`;
                const dateLabel = `${isEnded ? 'Closed' : 'Created'} ${formatLectureDate(
                  lecture.endedAt ?? lecture.createdAt
                )}`;
                const attendanceLabel = `${lecture.attendanceCount} checked in`;
                const lectureCardClassName = [
                  'gap-lg rounded-xl border bg-surfaceLowest p-xl active:scale-[0.985] active:opacity-90',
                  isLive ? 'border-success/25' : 'border-outlineVariant/35',
                ].join(' ');
                const statusBadgeClassName = [
                  'rounded-pill px-md py-sm',
                  isEnded ? 'bg-surfaceHigh' : isScheduled ? 'bg-primaryFixed' : 'bg-success/10',
                ].join(' ');
                const statusTextClassName = [
                  'text-micro font-extrabold uppercase tracking-[1px]',
                  isEnded
                    ? 'text-onSurfaceVariant'
                    : isScheduled
                      ? 'text-onPrimaryFixed'
                      : 'text-success',
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

                    <View className="flex-row items-end justify-between gap-md">
                      <View className="flex-1 items-start gap-xs">
                        <View className="max-w-full flex-row items-center gap-[6px] rounded-pill bg-surfaceHigh px-[14px] py-[10px]">
                          <MaterialIcons
                            color={themeColors.onSurfaceVariant}
                            name="event-available"
                            size={16}
                          />
                          <Text
                            numberOfLines={1}
                            className="shrink text-label font-extrabold text-onSurfaceVariant">
                            {dateLabel}
                          </Text>
                        </View>

                        <View className="max-w-full flex-row items-center gap-[6px] rounded-pill bg-surfaceHigh px-[14px] py-[10px]">
                          <MaterialIcons color={themeColors.onSurfaceVariant} name="groups" size={16} />
                          <Text
                            numberOfLines={1}
                            className="shrink text-label font-extrabold text-onSurfaceVariant">
                            {attendanceLabel}
                          </Text>
                        </View>
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
                              {exportingLectureId === lecture.id ? 'Exporting' : 'Export'}
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
              <MaterialIcons color={themeColors.primary} name="event-note" size={32} />
              <Text className="text-title font-extrabold text-onSurface">No lecture history yet</Text>
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

function StatCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  const { colors: themeColors } = useAppTheme();

  return (
    <View className="min-h-[118px] flex-1 gap-sm rounded-xl bg-surfaceLowest p-lg">
      <MaterialIcons color={themeColors.primary} name={icon} size={22} />
      <Text className="text-[26px] font-black text-onSurface">{value}</Text>
      <Text className="text-label font-bold text-onSurfaceVariant">{label}</Text>
    </View>
  );
}

function formatLectureDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
