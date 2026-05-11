import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { getCurrentDeviceLocation } from '@/services/device-location.service';
import {
  getInstructorLecture,
  InstructorLecture,
  isLectureDiscoverable,
  subscribeLiveLectures,
} from '@/services/lecture-session.service';
import { listStudentSessionHistory } from '@/services/student-session-history.service';
import {
  openAvailableSessionsScreen,
  openHistoryScreen,
  openLectureSessionInformationScreen,
} from '@/services/session-navigation.service';
import { getDisplayNameFromEmail, getInitialsFromEmail } from '@/utils/user';

export default function StudentHomeScreen() {
  const { colors: themeColors } = useAppTheme();
  const { authUser, profile } = useAuth();
  const [enteredLiveLectures, setEnteredLiveLectures] = useState<InstructorLecture[]>([]);
  const [scanSessionCount, setScanSessionCount] = useState(0);
  const email = profile?.email ?? authUser?.email ?? 'student@smartcampus.edu';
  const studentId = authUser?.uid ?? authUser?.email ?? 'local-student';
  const displayName = authUser?.displayName?.trim() || getDisplayNameFromEmail(email);
  const firstName = displayName.split(' ')[0] || 'Student';
  const initials = getInitialsFromEmail(email) || 'ST';

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let studentLocation: Awaited<ReturnType<typeof getCurrentDeviceLocation>> = null;
      let latestLectures: InstructorLecture[] = [];
      const updateScanSessionCount = () => {
        if (!isActive) {
          return;
        }

        setScanSessionCount(
          latestLectures.filter((lecture) =>
            isLectureDiscoverable(lecture, { location: studentLocation, searchKey: '' })
          ).length
        );
      };
      const unsubscribe = subscribeLiveLectures((lectures) => {
        latestLectures = lectures;
        updateScanSessionCount();
      });

      async function loadStudentHomeSessions() {
        studentLocation = await getCurrentDeviceLocation();
        updateScanSessionCount();
        const historyEntries = await listStudentSessionHistory(studentId);

        if (!isActive) {
          return;
        }

        const historyLectures = await Promise.all(
          historyEntries.map((entry) => getInstructorLecture(entry.lectureId))
        );

        if (!isActive) {
          return;
        }

        setEnteredLiveLectures(
          historyLectures.filter(
            (lecture): lecture is InstructorLecture =>
              Boolean(
                lecture &&
                  lecture.status === 'live' &&
                  lecture.attendanceEvents.some((event) => event.id === studentId)
              )
          )
        );
      }

      loadStudentHomeSessions();

      return () => {
        isActive = false;
        unsubscribe();
      };
    }, [studentId])
  );

  return (
    <ScreenShell>
      <View className="flex-1">
        <View className="flex-row items-center justify-between border-b border-outlineVariant/35 bg-surfaceLowest/90 px-xl pb-md pt-lg">
          <View className="flex-row items-center gap-md">
            <View className="h-10 w-10 items-center justify-center rounded-pill border-2 border-primaryFixed bg-primaryFixed">
              <Text className="text-label font-extrabold tracking-[0.6px] text-primary">
                {initials}
              </Text>
            </View>
            <Text className="text-title font-extrabold text-primary">Smart Campus</Text>
          </View>
          <Pressable className="h-10 w-10 items-center justify-center rounded-pill active:scale-[0.985] active:opacity-90">
            <MaterialIcons color={themeColors.outline} name="notifications-none" size={22} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerClassName="gap-xl px-xl pb-[140px] pt-xl"
          showsVerticalScrollIndicator={false}>
          <View className="gap-xs">
            <Text className="text-display font-extrabold leading-[40px] text-onSurface">
              Welcome {firstName}
            </Text>
          </View>

          <View className="rounded-xl bg-surfaceLowest p-xl">
            <View className="mb-xl flex-row items-start justify-between">
              <View className="flex-row items-center gap-xs rounded-pill bg-primaryFixed px-md py-[6px]">
                <MaterialIcons color={themeColors.onPrimaryFixed} name="wifi-tethering" size={14} />
                <Text className="text-[11px] font-extrabold uppercase tracking-[1px] text-onPrimaryFixed">
                  Live Sessions
                </Text>
              </View>
              <View className="items-end">
                <Text className="mb-xs text-label font-medium uppercase tracking-[0.8px] text-onSurfaceVariant">
                  In Scan
                </Text>
                <Text className="text-body font-extrabold text-primary">{scanSessionCount}</Text>
              </View>
            </View>

            <View className="mb-xxl items-center">
              <View className="mb-md h-[72px] w-[72px] items-center justify-center">
                <View className="absolute h-[72px] w-[72px] rounded-pill bg-primary/10" />
                <View className="h-16 w-16 items-center justify-center rounded-pill bg-primaryContainer">
                  <MaterialIcons color={themeColors.onPrimary} name="cast-connected" size={30} />
                </View>
              </View>
              <Text className="mb-sm text-[28px] font-extrabold text-onSurface">
                Lecture Check-In
              </Text>
            </View>

            <Pressable
              onPress={openAvailableSessionsScreen}
              className="min-h-[56px] flex-row items-center justify-center gap-md rounded-xl bg-primary active:scale-[0.985] active:opacity-90">
              <MaterialIcons color={themeColors.onPrimary} name="radar" size={20} />
              <Text className="text-[18px] font-extrabold text-onPrimary">
                Scan for Nearby Sessions
              </Text>
            </Pressable>
          </View>

          <View className="flex-row gap-lg">
            <View className="aspect-square flex-1 justify-between rounded-xl bg-surfaceLow p-[20px]">
              <View>
                <View className="mb-md">
                  <MaterialIcons color={themeColors.primary} name="wifi-tethering" size={24} />
                </View>
                <Text className="text-label font-extrabold uppercase tracking-[1px] text-onSurfaceVariant">
                  Joined Live
                </Text>
              </View>
              <View>
                <Text className="text-[36px] font-black text-onSurface">
                  {enteredLiveLectures.length}
                </Text>
                <View className="mt-md h-[6px] overflow-hidden rounded-pill bg-surfaceHigh">
                  <View
                    className={[
                      'h-full rounded-pill bg-primary',
                      enteredLiveLectures.length > 0 ? 'w-full' : 'w-0',
                    ].join(' ')}
                  />
                </View>
              </View>
            </View>

            <View className="aspect-square flex-1 justify-between rounded-xl bg-primaryFixed p-[20px]">
              <View>
                <View className="mb-md">
                  <MaterialIcons
                    color={themeColors.onPrimaryFixed}
                    name="verified-user"
                    size={24}
                  />
                </View>
                <Text className="text-label font-extrabold uppercase tracking-[1px] text-onPrimaryFixed">
                  Status
                </Text>
              </View>
              <View>
                <Text className="text-[28px] font-extrabold leading-[32px] text-onPrimaryFixed">
                  {enteredLiveLectures.length > 0 ? 'Joined' : 'Idle'}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-end justify-between">
            <Text className="text-[20px] font-extrabold text-onSurface">
              Your Active Sessions
            </Text>
            <Pressable onPress={openHistoryScreen}>
              <Text className="text-body font-extrabold text-primary">View History</Text>
            </Pressable>
          </View>

          {enteredLiveLectures.length > 0 ? (
            <View className="gap-md">
              {enteredLiveLectures.map((lecture) => (
                <Pressable
                  key={lecture.id}
                  onPress={() => openLectureSessionInformationScreen(lecture.id)}
                  className="flex-row items-center justify-between gap-md rounded-xl bg-surfaceLowest p-lg active:scale-[0.985] active:opacity-90">
                  <View className="flex-1 flex-row items-center gap-md">
                    <View className="h-[42px] w-[42px] items-center justify-center rounded-pill bg-successSoft">
                      <MaterialIcons color={themeColors.success} name="wifi-tethering" size={22} />
                    </View>
                    <View className="flex-1 gap-[3px]">
                      <Text className="text-bodyLg font-extrabold text-onSurface">
                        {lecture.title}
                      </Text>
                      <Text className="text-body font-semibold text-onSurfaceVariant">
                        {lecture.startTime} - {lecture.endTime}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-xs">
                    <Text className="text-micro font-extrabold uppercase tracking-[1px] text-primary">
                      {lecture.code}
                    </Text>
                    <MaterialIcons color={themeColors.primary} name="chevron-right" size={22} />
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View className="items-center gap-sm rounded-xl bg-surfaceLowest p-xl">
              <MaterialIcons color={themeColors.outlineVariant} name="event-busy" size={34} />
              <Text className="text-title font-extrabold text-onSurface">
                No joined live sessions
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenShell>
  );
}
