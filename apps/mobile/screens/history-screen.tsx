import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/hooks/use-auth";
import { openLectureSessionInformationScreen } from "@/services/session-navigation.service";
import {
  listStudentSessionHistory,
  subscribeStudentSessionHistory,
  StudentSessionHistoryEntry,
} from "@/services/student-session-history.service";
import { getInitialsFromEmail } from "@/utils/user";

export default function HistoryScreen() {
  const { colors: themeColors } = useAppTheme();
  const { authUser, profile } = useAuth();
  const [entries, setEntries] = useState<StudentSessionHistoryEntry[]>([]);
  const email = profile?.email ?? authUser?.email ?? "student@smartcampus.edu";
  const studentId = authUser?.uid ?? authUser?.email ?? "local-student";
  const initials = getInitialsFromEmail(email) || "ST";

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const unsubscribe = subscribeStudentSessionHistory(studentId, (historyEntries) => {
        if (isActive) {
          setEntries(historyEntries);
        }
      });

      listStudentSessionHistory(studentId).then((historyEntries) => {
        if (isActive) {
          setEntries(historyEntries);
        }
      });

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
            <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-pill bg-surfaceHigh">
              <Text className="text-label font-extrabold tracking-[0.6px] text-primary">
                {initials}
              </Text>
            </View>
            <Text className="text-title font-extrabold text-primary">
              Smart Campus
            </Text>
          </View>

          <Pressable className="h-10 w-10 items-center justify-center rounded-pill active:scale-[0.99] active:opacity-85">
            <MaterialIcons
              color={themeColors.onSurface}
              name="notifications-none"
              size={22}
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerClassName="gap-xl px-xl pb-[140px] pt-xl"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-xs">
            <Text className="text-display font-black leading-[48px] text-onSurface">
              Attendance History
            </Text>
          </View>

          <View className="flex-row gap-md">
            <View className="flex-1 gap-sm rounded-xl bg-surfaceLowest p-lg">
              <Text className="text-label font-extrabold uppercase tracking-[1px] text-onSurfaceVariant">
                Entered Sessions
              </Text>
              <Text className="text-[30px] font-black text-onSurface">
                {entries.length}
              </Text>
            </View>

            <View className="flex-1 gap-sm rounded-xl bg-surfaceLow p-lg">
              <Text className="text-label font-extrabold uppercase tracking-[1px] text-onSurfaceVariant">
                Source
              </Text>
              <Text className="text-headline font-black text-onSurface">
                Live
              </Text>
            </View>
          </View>

          {entries.length > 0 ? (
            <View className="gap-md">
              {entries.map((entry) => (
                <Pressable
                  key={`${entry.studentId}-${entry.lectureId}`}
                  onPress={() =>
                    openLectureSessionInformationScreen(entry.lectureId)
                  }
                  className="flex-row items-center justify-between gap-md rounded-xl bg-surfaceLowest p-lg active:scale-[0.99] active:opacity-85"
                >
                  <View className="flex-1 flex-row items-center gap-md">
                    <View className="h-[42px] w-[42px] items-center justify-center rounded-pill bg-primarySoft">
                      <MaterialIcons
                        color={themeColors.primary}
                        name="history-edu"
                        size={24}
                      />
                    </View>

                    <View className="flex-1 gap-[3px]">
                      <Text className="text-bodyLg font-extrabold text-onSurface">
                        {entry.title}
                      </Text>
                      <View className="flex-row items-center gap-xs">
                        <MaterialIcons
                          color={themeColors.onSurfaceVariant}
                          name="schedule"
                          size={12}
                        />
                        <Text className="text-label text-onSurfaceVariant">
                          {entry.time}
                        </Text>
                      </View>
                      <Text className="text-label text-onSurfaceVariant">
                        Entered {formatHistoryDate(entry.enteredAt)}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end gap-sm">
                    <View className="rounded-pill bg-successSoft px-[10px] py-[6px]">
                      <Text className="text-micro font-extrabold uppercase tracking-[1px] text-success">
                        Entered
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View className="items-center gap-sm rounded-xl bg-surfaceLowest p-xl">
              <MaterialIcons
                color={themeColors.outlineVariant}
                name="event-busy"
                size={38}
              />
              <Text className="text-title font-extrabold text-onSurface">
                No session history yet
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenShell>
  );
}

function formatHistoryDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return date.toLocaleString(undefined, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  });
}
