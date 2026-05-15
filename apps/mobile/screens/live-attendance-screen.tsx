import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ScreenShell } from '@/components/screen-shell';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import {
  endLiveAttendanceSession,
  getDurationLabel,
  getLectureDiscoveryMode,
  InstructorLecture,
  LectureAttendanceEvent,
  listInstructorLectures,
  subscribeLecture,
} from '@/services/lecture-session.service';
import { openInstructorDashboard } from '@/services/instructor-navigation.service';
import { exportLectureAttendanceReport } from '@/services/attendance-report-export.service';
import { getInitialsFromEmail } from '@/utils/user';

export default function LiveAttendanceScreen() {
  const { colors: themeColors } = useAppTheme();
  const params = useLocalSearchParams<{
    days?: string;
    lectureId?: string;
    lectureName?: string;
    startTime?: string;
  }>();
  const { authUser } = useAuth();
  const [activeCount, setActiveCount] = useState(0);
  const [attendanceFeed, setAttendanceFeed] = useState<LectureAttendanceEvent[]>([]);
  const [lecture, setLecture] = useState<InstructorLecture | null>(null);
  const [lectureLoaded, setLectureLoaded] = useState(!params.lectureId);
  const [isEnding, setIsEnding] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<LectureAttendanceEvent | null>(null);
  const [studentLectureSessions, setStudentLectureSessions] = useState<InstructorLecture[]>([]);

  const instructorId = authUser?.uid ?? authUser?.email ?? 'local-instructor';
  const lectureName = lecture?.title ?? params.lectureName ?? 'Lecture';
  const startTime = lecture?.startTime ?? params.startTime ?? '09:00 AM';
  const endTime = lecture?.endTime;
  const recurrence = lecture?.days.length
    ? lecture.days.join(' • ')
    : params.days
      ? params.days.split(',').filter(Boolean).join(' • ')
      : 'No recurrence';
  const sessionLive = lecture?.status === 'live';
  const sessionScheduled = lecture?.status === 'scheduled';
  const sessionEnded = lecture?.status === 'ended';
  const sessionLoading = Boolean(params.lectureId) && !lectureLoaded;
  const activeLiveCount = sessionEnded ? 0 : activeCount;
  const shouldShowRealTimeCheckIns = !sessionLoading && !sessionEnded;
  const sessionBadgeText = sessionLoading
    ? 'Loading'
    : sessionEnded
      ? 'Session Ended'
      : sessionScheduled
        ? 'Scheduled'
        : 'Live Now';
  const initials = getInitialsFromEmail(authUser?.email ?? 'instructor@smartcampus.edu');
  const durationValue = lecture ? String(lecture.durationMinutes) : '--';
  const sessionCode = lecture?.code ?? `ATT-${lectureName.slice(0, 3).toUpperCase()}-24`;
  const discoveryMode = lecture ? getLectureDiscoveryMode(lecture) : 'nearby';
  const discoveryLabel =
    discoveryMode === 'both'
      ? `Nearby + key ${lecture?.discoveryKey ?? sessionCode}`
      : discoveryMode === 'search-key'
      ? `Search key ${lecture?.discoveryKey ?? sessionCode}`
      : 'Nearby discovery';
  const discoveryIcon =
    discoveryMode === 'both'
      ? 'travel-explore'
      : discoveryMode === 'search-key'
        ? 'key'
        : 'location-on';

  useEffect(() => {
    if (!params.lectureId) {
      setLectureLoaded(true);
      return;
    }

    setLectureLoaded(false);
    const unsubscribe = subscribeLecture(
      params.lectureId,
      (nextLecture) => {
        setLecture(nextLecture);
        setActiveCount(nextLecture?.attendanceCount ?? 0);
        setAttendanceFeed(nextLecture?.attendanceEvents ?? []);
        setLectureLoaded(true);
      },
      () => {
        setLecture(null);
        setActiveCount(0);
        setAttendanceFeed([]);
        setLectureLoaded(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [params.lectureId]);

  useEffect(() => {
    if (!sessionEnded || !selectedStudent) {
      return;
    }

    setSelectedStudent(null);
    setStudentLectureSessions([]);
  }, [selectedStudent, sessionEnded]);

  async function handleEndSession() {
    if (!lecture || !sessionLive || isEnding) {
      return;
    }

    setIsEnding(true);

    try {
      const endedLecture = await endLiveAttendanceSession(lecture.id, {
        attendanceCount: activeCount,
        attendanceEvents: attendanceFeed,
      });

      if (endedLecture) {
        setLecture(endedLecture);
        setActiveCount(endedLecture.attendanceCount);
        setAttendanceFeed(endedLecture.attendanceEvents);
      }
    } finally {
      setIsEnding(false);
    }
  }

  async function openStudentDetails(entry: LectureAttendanceEvent) {
    setSelectedStudent(entry);

    const instructorLectures = await listInstructorLectures(instructorId);
    setStudentLectureSessions(
      instructorLectures.filter((item) =>
        item.attendanceEvents.some((event) => event.id === entry.id)
      )
    );
  }

  function closeStudentDetails() {
    setSelectedStudent(null);
    setStudentLectureSessions([]);
  }

  async function handleExportReport() {
    if (!lecture || isExporting) {
      return;
    }

    setIsExporting(true);

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
      setIsExporting(false);
    }
  }

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    openInstructorDashboard();
  }

  return (
    <ScreenShell>
      <View className="flex-1">
        <View className="flex-row items-center justify-between border-b border-outlineVariant/35 bg-surfaceLowest/90 px-xl pb-md pt-lg">
          <View className="flex-row items-center gap-md">
            <Pressable
              onPress={handleBack}
              className="h-10 w-10 items-center justify-center rounded-pill active:scale-[0.985] active:opacity-90">
              <MaterialIcons color={themeColors.primary} name="arrow-back" size={22} />
            </Pressable>
            <Text className="text-title font-extrabold text-primary">Live Attendance</Text>
          </View>

          <View className="h-10 w-10 items-center justify-center rounded-pill bg-primaryFixed">
            <Text className="text-label font-extrabold tracking-[0.6px] text-primary">
              {initials || 'IN'}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerClassName="gap-xl px-xl pb-[56px] pt-xl"
          showsVerticalScrollIndicator={false}>
          <View className="gap-sm">
            <View className="flex-row items-center justify-between">
              <View
                className={[
                  'flex-row items-center gap-xs rounded-pill px-md py-[6px]',
                  sessionScheduled
                    ? 'bg-primaryFixed'
                    : sessionEnded
                      ? 'bg-surfaceHigh'
                      : 'bg-tertiary/10',
                ].join(' ')}>
                <View
                  className={[
                    'h-2 w-2 rounded-pill',
                    sessionScheduled
                      ? 'bg-primary'
                      : sessionEnded
                        ? 'bg-onSurfaceVariant'
                        : 'bg-tertiary',
                  ].join(' ')}
                />
                <Text
                  className={[
                    'text-micro font-extrabold uppercase tracking-[1px]',
                    sessionEnded ? 'text-onSurfaceVariant' : 'text-onPrimaryFixed',
                  ].join(' ')}>
                  {sessionBadgeText}
                </Text>
              </View>

              <View className="flex-row items-center gap-xs rounded-pill bg-primaryFixed px-md py-[6px]">
                <MaterialIcons color={themeColors.onPrimaryFixed} name="schedule" size={14} />
                <Text className="text-micro font-extrabold uppercase tracking-[1px] text-onPrimaryFixed">
                  {endTime ? `${startTime} - ${endTime}` : startTime}
                </Text>
              </View>
            </View>

            <Text className="text-display font-black leading-[42px] text-onSurface">
              {lectureName}
            </Text>
            <Text className="text-bodyLg font-semibold text-onSurfaceVariant">
              Recurring on {recurrence}
            </Text>
          </View>

          <View className="flex-row gap-md">
            <MetricCard
              icon="groups"
              label={sessionEnded ? 'Active Now' : 'Checked In'}
              tone="primary"
              value={String(activeLiveCount)}
            />
            <MetricCard
              icon="analytics"
              label="Minutes"
              tone="tertiary"
              value={durationValue}
            />
          </View>

          <View className="gap-md rounded-xl bg-surfaceLowest p-xl">
            <View className="flex-row items-center justify-between">
              <Text className="text-title font-extrabold text-onSurface">
                {sessionEnded
                  ? 'Session Report Ready'
                  : sessionScheduled
                    ? 'Scheduled Attendance'
                    : 'Live Session Beacon'}
              </Text>
              <View
                className={[
                  'flex-row items-center gap-xs rounded-pill px-[10px] py-[6px]',
                  sessionScheduled || sessionEnded ? 'bg-surfaceHigh' : 'bg-success/10',
                ].join(' ')}>
                <MaterialIcons
                  color={
                    sessionEnded || sessionScheduled
                      ? themeColors.onSurfaceVariant
                      : themeColors.success
                  }
                  name={sessionEnded ? 'task-alt' : sessionScheduled ? 'event' : 'wifi-tethering'}
                  size={16}
                />
                <Text
                  className={[
                    'text-micro font-extrabold uppercase tracking-[1px]',
                    sessionScheduled || sessionEnded ? 'text-onSurfaceVariant' : 'text-success',
                  ].join(' ')}>
                  {sessionEnded ? 'Ended' : sessionScheduled ? 'Waiting' : 'Broadcasting'}
                </Text>
              </View>
            </View>

            <Text className="text-[30px] font-black text-primary">{sessionCode}</Text>
            {!sessionEnded ? (
              <View className="flex-row flex-wrap items-center gap-sm">
                <View className="flex-row items-center gap-xs self-start rounded-pill bg-primarySoft px-md py-[7px]">
                  <MaterialIcons color={themeColors.primary} name="pin" size={16} />
                  <Text className="text-label font-black tracking-[1px] text-primary">
                    PIN {lecture?.sessionPin ?? '----'}
                  </Text>
                </View>

                <View className="flex-row items-center gap-xs self-start rounded-pill bg-surfaceHigh px-md py-[7px]">
                  <MaterialIcons
                    color={themeColors.onSurfaceVariant}
                    name={discoveryIcon}
                    size={16}
                  />
                  <Text className="text-label font-black tracking-[0.5px] text-onSurfaceVariant">
                    {discoveryLabel}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          {sessionEnded ? (
            <View className="gap-lg rounded-xl bg-surfaceLowest p-xl">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-micro font-extrabold uppercase tracking-[1px] text-success">
                    Attendance Report
                  </Text>
                  <Text className="mt-[2px] text-title font-extrabold text-onSurface">
                    {lectureName}
                  </Text>
                </View>
                <MaterialIcons color={themeColors.success} name="verified" size={24} />
              </View>

              <View className="gap-xs">
                <ReportRow label="Started" value={startTime} />
                <ReportRow label="Planned End" value={endTime ?? '--'} />
                <ReportRow label="Closed At" value={formatReportClock(lecture?.endedAt)} />
                <ReportRow
                  label="Duration"
                  value={lecture ? getDurationLabel(lecture.durationMinutes) : '--'}
                />
                <ReportRow label="Checked In" value={`${activeCount} students`} />
              </View>

              <Pressable
                disabled={!lecture || isExporting}
                onPress={handleExportReport}
                className={[
                  'flex-row items-center justify-center gap-sm rounded-xl bg-primarySoft py-[14px] active:scale-[0.985] active:opacity-90',
                  !lecture || isExporting ? 'opacity-55' : '',
                ].join(' ')}>
                <MaterialIcons color={themeColors.primary} name="download" size={18} />
                <Text className="text-body font-black text-primary">
                  {isExporting ? 'Downloading...' : 'Download Excel Report'}
                </Text>
              </Pressable>

              <Pressable
                onPress={openInstructorDashboard}
                className="flex-row items-center justify-center gap-sm self-stretch rounded-xl bg-primary py-[14px] active:scale-[0.985] active:opacity-90">
                <Text className="text-body font-extrabold text-onPrimary">Back to Dashboard</Text>
                <MaterialIcons color={themeColors.onPrimary} name="arrow-forward" size={18} />
              </Pressable>
            </View>
          ) : null}

          {shouldShowRealTimeCheckIns ? (
            <>
              <View className="flex-row items-center justify-between">
                <Text className="text-title font-extrabold text-onSurface">
                  Real-Time Check-Ins
                </Text>
                <Text className="text-label font-semibold text-onSurfaceVariant">
                  {sessionScheduled ? 'Not open yet' : 'Waiting for students'}
                </Text>
              </View>

              <View className="gap-md">
                {attendanceFeed.length > 0 ? (
                  attendanceFeed.map((entry) => (
                    <Pressable
                      key={entry.id}
                      onPress={() => openStudentDetails(entry)}
                      className="flex-row items-center gap-md rounded-xl bg-surfaceLowest p-lg active:scale-[0.985] active:opacity-90">
                      <View className="h-[42px] w-[42px] items-center justify-center rounded-pill bg-primaryFixed">
                        <Text className="text-label font-extrabold text-primary">
                          {entry.name
                            .split(' ')
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join('')}
                        </Text>
                      </View>

                      <View className="flex-1 gap-[2px]">
                        <Text className="text-bodyLg font-bold text-onSurface">{entry.name}</Text>
                        <Text className="text-body text-onSurfaceVariant">{entry.status}</Text>
                      </View>

                      <MaterialIcons color={themeColors.success} name="check-circle" size={22} />
                    </Pressable>
                  ))
                ) : (
                  <View className="items-center gap-sm rounded-xl bg-surfaceLowest p-xl">
                    <MaterialIcons color={themeColors.outlineVariant} name="person-search" size={28} />
                    <Text className="text-bodyLg font-extrabold text-onSurface">
                      No check-ins yet
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : null}

          {sessionLive ? (
            <Pressable
              disabled={!lecture || isEnding}
              onPress={handleEndSession}
              className={[
                'flex-row items-center justify-center gap-sm rounded-xl bg-error/10 py-[16px] active:scale-[0.985] active:opacity-90',
                !lecture || isEnding ? 'opacity-55' : '',
              ].join(' ')}>
              <MaterialIcons color={themeColors.error} name="stop-circle" size={20} />
              <Text className="text-body font-extrabold text-error">
                {isEnding ? 'Ending Attendance...' : 'End Live Attendance'}
              </Text>
            </Pressable>
          ) : null}
        </ScrollView>

        <StudentDetailsModal
          onClose={closeStudentDetails}
          sessions={studentLectureSessions}
          student={selectedStudent}
        />
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
  const { colors: themeColors } = useAppTheme();
  const iconColor = tone === 'primary' ? themeColors.primary : themeColors.tertiary;
  const cardClassName = [
    'flex-1 gap-sm rounded-xl p-lg',
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

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-outlineVariant/30 py-md">
      <Text className="text-body font-bold text-onSurfaceVariant">{label}</Text>
      <Text className="text-body font-extrabold text-onSurface">{value}</Text>
    </View>
  );
}

function StudentDetailsModal({
  onClose,
  sessions,
  student,
}: {
  onClose: () => void;
  sessions: InstructorLecture[];
  student: LectureAttendanceEvent | null;
}) {
  const { colors: themeColors } = useAppTheme();
  const entryCount = student?.checkInCount ?? 1;
  const entryCountLabel = `${entryCount} ${entryCount === 1 ? 'time' : 'times'}`;

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={Boolean(student)}>
      <View className="flex-1 justify-end">
        <Pressable
          onPress={onClose}
          className="absolute inset-0 bg-[rgba(11,18,32,0.48)]"
        />

        <View className="max-h-[82%] gap-lg rounded-t-[28px] bg-surfaceLowest p-xl">
          <View className="mb-lg h-[4px] w-[42px] self-center rounded-pill bg-outlineVariant" />

          <View className="flex-row items-center justify-between">
            <Text className="text-title font-black text-onSurface">Student Details</Text>
            <Pressable
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-pill bg-surfaceHigh active:scale-[0.985] active:opacity-90">
              <MaterialIcons color={themeColors.onSurfaceVariant} name="close" size={20} />
            </Pressable>
          </View>

          {student ? (
            <>
              <View className="flex-row items-center gap-md rounded-xl bg-surfaceHigh p-lg">
                <View className="h-[58px] w-[58px] items-center justify-center rounded-pill bg-primaryFixed">
                  <Text className="text-bodyLg font-black text-primary">
                    {getStudentInitials(student.name)}
                  </Text>
                </View>

                <View className="flex-1 gap-[3px]">
                  <Text className="text-bodyLg font-black text-onSurface">{student.name}</Text>
                  <Text className="text-body font-semibold text-onSurfaceVariant">
                    {student.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-md">
                <View className="flex-1 gap-xs rounded-xl bg-primarySoft p-md">
                  <Text className="text-micro font-extrabold uppercase tracking-[0.8px] text-onSurfaceVariant">
                    This lecture
                  </Text>
                  <Text className="text-body font-black text-primary">
                    Entered {entryCountLabel}
                  </Text>
                </View>

                <View className="flex-1 gap-xs rounded-xl bg-primarySoft p-md">
                  <Text className="text-micro font-extrabold uppercase tracking-[0.8px] text-onSurfaceVariant">
                    Latest check-in
                  </Text>
                  <Text className="text-body font-black text-primary">
                    {formatReportClock(student.checkedInAt)}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-bodyLg font-black text-onSurface">Joined Lectures</Text>
                <Text className="text-label font-bold text-onSurfaceVariant">
                  Same instructor only
                </Text>
              </View>

              <View className="gap-md">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <View
                      key={session.id}
                      className="flex-row items-center justify-between gap-md rounded-xl border border-outlineVariant/35 bg-surfaceLowest p-md">
                      <View className="flex-1 gap-[3px]">
                        <Text className="text-body font-extrabold text-onSurface">
                          {session.title}
                        </Text>
                        <Text className="text-label font-semibold text-onSurfaceVariant">
                          {session.code} • {session.startTime} - {session.endTime}
                        </Text>
                      </View>

                      <View
                        className={[
                          'rounded-pill px-[10px] py-[6px]',
                          session.status === 'ended' ? 'bg-surfaceHigh' : 'bg-success/10',
                        ].join(' ')}>
                        <Text
                          className={[
                            'text-micro font-black uppercase tracking-[0.8px]',
                            session.status === 'ended'
                              ? 'text-onSurfaceVariant'
                              : 'text-success',
                          ].join(' ')}>
                          {session.status === 'ended' ? 'Ended' : 'Live'}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="items-center gap-xs rounded-xl bg-surfaceHigh p-lg">
                    <MaterialIcons color={themeColors.outlineVariant} name="event-busy" size={24} />
                    <Text className="text-body font-extrabold text-onSurface">
                      No joined sessions found
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function getStudentInitials(name: string) {
  return (
    name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'ST'
  );
}

function formatReportClock(value?: string) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}
