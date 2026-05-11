import { MaterialIcons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { InstructorLecture } from '@/services/lecture-session.service';
import { getDisplayNameFromEmail } from '@/utils/user';

type SessionKeySearchModalProps = {
  hasSearchedSessionKey: boolean;
  normalizedSearchKey: string;
  onChangeSearchKey: (value: string) => void;
  onClose: () => void;
  onOpenLecture: (lectureId: string) => void;
  onSearch: () => void;
  searchKey: string;
  searchedSessionKey: string;
  sessionKeyResults: InstructorLecture[];
  visible: boolean;
};

export function SessionKeySearchModal({
  hasSearchedSessionKey,
  normalizedSearchKey,
  onChangeSearchKey,
  onClose,
  onOpenLecture,
  onSearch,
  searchKey,
  searchedSessionKey,
  sessionKeyResults,
  visible,
}: SessionKeySearchModalProps) {
  const { colors: themeColors } = useAppTheme();

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        className="flex-1"
        keyboardVerticalOffset={24}>
        <Pressable onPress={onClose} className="absolute inset-0 bg-[rgba(8,12,25,0.38)]" />

        <View className="flex-1 items-center justify-center px-xl py-xl">
          <View className="max-h-full w-full max-w-[420px] overflow-hidden rounded-xl bg-surfaceLowest">
            <ScrollView
              bounces={false}
              contentContainerClassName="gap-xl p-xl"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View className="flex-row items-center justify-between gap-lg">
                <View className="flex-1 gap-xs">
                  <Text className="text-headline font-extrabold text-onSurface">Find Session</Text>
                  <Text className="text-body font-semibold leading-[22px] text-onSurfaceVariant">
                    Enter the session key from your instructor.
                  </Text>
                </View>

                <Pressable
                  onPress={onClose}
                  className="h-10 w-10 items-center justify-center rounded-pill bg-surfaceHigh active:scale-[0.99] active:opacity-85">
                  <MaterialIcons color={themeColors.onSurfaceVariant} name="close" size={20} />
                </Pressable>
              </View>

              <AppTextField
                autoCapitalize="characters"
                label="Session Key"
                onChangeText={onChangeSearchKey}
                placeholder="Enter search key"
                rightAdornment={<MaterialIcons color={themeColors.outline} name="key" size={20} />}
                value={searchKey}
              />

              <AppButton
                disabled={normalizedSearchKey.length < 2}
                label="Search"
                onPress={onSearch}
                trailing={<MaterialIcons color={themeColors.onPrimary} name="search" size={20} />}
              />

              {hasSearchedSessionKey ? (
                <SessionKeyResults
                  onClose={onClose}
                  onOpenLecture={onOpenLecture}
                  searchedSessionKey={searchedSessionKey}
                  sessionKeyResults={sessionKeyResults}
                />
              ) : null}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function SessionKeyResults({
  onClose,
  onOpenLecture,
  searchedSessionKey,
  sessionKeyResults,
}: {
  onClose: () => void;
  onOpenLecture: (lectureId: string) => void;
  searchedSessionKey: string;
  sessionKeyResults: InstructorLecture[];
}) {
  return (
    <View className="gap-md">
      <Text className="text-label font-extrabold uppercase tracking-[1px] text-onSurfaceVariant">
        Result for {searchedSessionKey}
      </Text>

      {sessionKeyResults.length > 0 ? (
        <View className="gap-md">
          {sessionKeyResults.map((lecture) => (
            <SessionKeyResultCard
              key={lecture.id}
              lecture={lecture}
              onPress={() => {
                onClose();
                onOpenLecture(lecture.id);
              }}
            />
          ))}
        </View>
      ) : (
        <EmptyKeyResultState />
      )}
    </View>
  );
}

function SessionKeyResultCard({
  lecture,
  onPress,
}: {
  lecture: InstructorLecture;
  onPress: () => void;
}) {
  const { colors: themeColors } = useAppTheme();
  const instructor = lecture.instructorEmail
    ? getDisplayNameFromEmail(lecture.instructorEmail)
    : 'Instructor';

  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl border border-outlineVariant/30 bg-surfaceLow p-lg active:scale-[0.99] active:opacity-90">
      <View className="mb-md gap-md">
        <View className="flex-row items-center gap-xs">
          <MaterialIcons color={themeColors.primary} name="key" size={16} />
          <Text className="text-micro font-extrabold uppercase tracking-[0.9px] text-primary">
            Key match
          </Text>
        </View>

        <View className="gap-xs">
          <Text className="text-bodyLg font-extrabold text-onSurface">{lecture.title}</Text>
          <Text className="text-body font-semibold text-onSurfaceVariant">{instructor}</Text>
        </View>

        <Text className="text-label font-bold text-onSurfaceVariant">
          {lecture.startTime} - {lecture.endTime}
        </Text>
      </View>

      <View className="flex-row items-center justify-end gap-xs border-t border-outlineVariant/20 pt-md">
        <Text className="text-body font-extrabold text-primary">Enter</Text>
        <MaterialIcons color={themeColors.primary} name="chevron-right" size={18} />
      </View>
    </Pressable>
  );
}

function EmptyKeyResultState() {
  const { colors: themeColors } = useAppTheme();

  return (
    <View className="items-center rounded-xl border-2 border-dashed border-outlineVariant/20 bg-surfaceLow/30 p-xl">
      <MaterialIcons color={themeColors.outlineVariant} name="event-busy" size={32} />
      <Text className="mt-sm text-center text-body leading-[22px] text-onSurfaceVariant">
        No open session matches this key.
      </Text>
    </View>
  );
}
