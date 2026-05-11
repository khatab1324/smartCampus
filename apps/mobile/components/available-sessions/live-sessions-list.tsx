import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import type { DeviceLocation } from '@/services/device-location.service';
import {
  getLectureDistanceMeters,
  type InstructorLecture,
} from '@/services/lecture-session.service';
import { getDisplayNameFromEmail } from '@/utils/user';

type LiveSessionsListProps = {
  lectures: InstructorLecture[];
  onOpenLecture: (lectureId: string) => void;
  studentLocation: DeviceLocation | null;
};

export function LiveSessionsList({
  lectures,
  onOpenLecture,
  studentLocation,
}: LiveSessionsListProps) {
  const hasLocation = Boolean(studentLocation);

  return (
    <>
      <View className="mb-md px-[2px]">
        <Text className="text-label font-extrabold uppercase tracking-[1.3px] text-onSurfaceVariant">
          Found ({lectures.length})
        </Text>
      </View>

      {lectures.length > 0 ? (
        <View className="gap-lg">
          {lectures.map((lecture) => (
            <LiveSessionCard
              key={lecture.id}
              lecture={lecture}
              onOpenLecture={onOpenLecture}
              studentLocation={studentLocation}
            />
          ))}
        </View>
      ) : (
        <EmptySessionsState hasLocation={hasLocation} />
      )}
    </>
  );
}

function LiveSessionCard({
  lecture,
  onOpenLecture,
  studentLocation,
}: {
  lecture: InstructorLecture;
  onOpenLecture: (lectureId: string) => void;
  studentLocation: DeviceLocation | null;
}) {
  const { colors: themeColors } = useAppTheme();
  const instructor = lecture.instructorEmail
    ? getDisplayNameFromEmail(lecture.instructorEmail)
    : 'Instructor';
  const distanceMeters = getLectureDistanceMeters(lecture, studentLocation);
  const discoveryLabel =
    distanceMeters === null ? 'Nearby' : `${Math.max(1, Math.round(distanceMeters))}m away`;

  return (
    <View className="rounded-xl border border-outlineVariant/30 bg-surfaceLowest p-xl">
      <View className="mb-lg">
        <View className="flex-1">
          <View className="mb-xs flex-row items-center gap-sm">
            <View className="flex-row items-center gap-[4px] rounded-sm bg-surfaceHigh px-sm py-xs">
              <MaterialIcons color={themeColors.onSurfaceVariant} name="location-on" size={13} />
              <Text className="text-micro font-extrabold uppercase tracking-[0.9px] text-onSurfaceVariant">
                {discoveryLabel}
              </Text>
            </View>
            <MaterialIcons color={themeColors.success} name="wifi-tethering" size={16} />
          </View>

          <Text className="mb-xs text-[22px] font-extrabold text-onSurface">
            {lecture.title}
          </Text>

          <View className="flex-row items-center gap-xs">
            <MaterialIcons color={themeColors.onSurfaceVariant} name="person" size={16} />
            <Text className="text-body text-onSurfaceVariant">{instructor}</Text>
          </View>
        </View>

        <View className="absolute right-0 top-0 items-end">
          <Text className="text-right text-bodyLg font-extrabold text-primary">Live</Text>
          <Text className="mt-xs text-right text-label font-semibold text-onSurfaceVariant/70">
            {lecture.startTime} - {lecture.endTime}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-outlineVariant/20 pt-lg">
        <Pressable
          onPress={() => onOpenLecture(lecture.id)}
          className="min-h-[42px] min-w-[116px] flex-row items-center justify-center gap-xs rounded-pill bg-primary px-[22px] active:scale-[0.99] active:opacity-85">
          <Text className="text-body font-extrabold text-onPrimary">Enter</Text>
          <MaterialIcons color={themeColors.onPrimary} name="chevron-right" size={16} />
        </Pressable>
      </View>
    </View>
  );
}

function EmptySessionsState({ hasLocation }: { hasLocation: boolean }) {
  const { colors: themeColors } = useAppTheme();

  return (
    <View className="items-center rounded-xl border-2 border-dashed border-outlineVariant/20 bg-surfaceLow/30 p-xl">
      <MaterialIcons color={themeColors.outlineVariant} name="event-busy" size={36} />
      <Text className="mt-sm text-center text-body leading-[22px] text-onSurfaceVariant">
        {hasLocation ? 'No nearby open sessions right now.' : 'Allow location access or enter a session key.'}
      </Text>
    </View>
  );
}
