import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import { router } from "expo-router";
import { updateProfile } from "firebase/auth";
import { useCallback, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { AppTextField } from "@/components/app-text-field";
import { ScreenShell } from "@/components/screen-shell";
import type { AppColorTokens } from "@/constants/tokens";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/hooks/use-auth";
import { routes } from "@/navigation/routes";
import { syncCurrentUserProfile } from "@/services/firebase-auth.service";
import {
  InstructorLecture,
  subscribeInstructorLectures,
} from "@/services/lecture-session.service";
import { withAlpha } from "@/utils/color";
import { getDisplayNameFromEmail, getInitialsFromEmail } from "@/utils/user";
import { createProfileThemeStyles } from "./profile-screen.styles";

type SettingsRow = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBackground: string;
  iconColor: string;
  id: string;
  label: string;
  value?: string;
};

export default function ProfileScreen() {
  const { authUser, profile, refreshProfile, signOutCurrentUser } = useAuth();
  const {
    colors: themeColors,
    setThemePreference,
    themePreference,
  } = useAppTheme();
  const [instructorLectures, setInstructorLectures] = useState<
    InstructorLecture[]
  >([]);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [personalInfoVisible, setPersonalInfoVisible] = useState(false);
  const [draftDisplayName, setDraftDisplayName] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const email = profile?.email ?? authUser?.email ?? "Not signed in";
  const displayName =
    authUser?.displayName?.trim() || getDisplayNameFromEmail(email);
  const initials = getInitialsFromEmail(email) || "SC";
  const role = profile?.role ?? "student";
  const roleLabel = role === "instructor" ? "Instructor" : "Student";
  const instructorId = authUser?.uid ?? authUser?.email ?? "local-instructor";
  const completedLectureCount = instructorLectures.filter(
    (lecture) => lecture.status === "ended"
  ).length;
  const liveLectureCount = instructorLectures.filter(
    (lecture) => lecture.status === "live"
  ).length;
  const isEmailVerified = Boolean(
    profile?.isEmailVerified || authUser?.emailVerified
  );
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const themeStyles = createProfileThemeStyles(themeColors);
  const appRows = buildAppRows(themeColors);
  const accountRows = buildAccountRows({
    isEmailVerified,
    roleLabel,
    themeColors,
  });
  const stats =
    role === "instructor"
      ? [
          {
            icon: "school" as const,
            label: "Created Lectures",
            tone: "primary" as const,
            value: String(instructorLectures.length),
          },
          {
            icon: "analytics" as const,
            label: "Reports Ready",
            tone: "tertiary" as const,
            value: String(completedLectureCount),
          },
        ]
      : [
          {
            icon: "verified-user" as const,
            label: "Email Verified",
            tone: "primary" as const,
            value: isEmailVerified ? "Yes" : "No",
          },
          {
            icon: "person" as const,
            label: "Account Role",
            tone: "tertiary" as const,
            value: roleLabel,
          },
        ];

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (role !== "instructor") {
        setInstructorLectures([]);
        return () => {
          isActive = false;
        };
      }

      const unsubscribe = subscribeInstructorLectures(instructorId, (lectures) => {
        if (isActive) {
          setInstructorLectures(lectures);
        }
      });

      return () => {
        isActive = false;
        unsubscribe();
      };
    }, [instructorId, role])
  );

  async function handleLogout() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await signOutCurrentUser();
      router.replace(routes.login);
    } finally {
      setIsSigningOut(false);
    }
  }

  function openPersonalInfoModal() {
    setDraftDisplayName(displayName);
    setProfileError("");
    setPersonalInfoVisible(true);
  }

  function closePersonalInfoModal() {
    if (isSavingProfile) {
      return;
    }

    setPersonalInfoVisible(false);
    setProfileError("");
  }

  async function handleSavePersonalInfo() {
    const nextDisplayName = draftDisplayName.trim();

    if (!nextDisplayName) {
      setProfileError("Display name is required.");
      return;
    }

    setIsSavingProfile(true);
    setProfileError("");

    try {
      if (authUser) {
        await updateProfile(authUser, { displayName: nextDisplayName });
      }

      await syncCurrentUserProfile({
        role,
        universityNumber:
          role === "instructor" ? profile?.universityNumber : undefined,
      });
      await refreshProfile();
      setPersonalInfoVisible(false);
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : "Could not update profile."
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  return (
    <ScreenShell style={themeStyles.screenBackground}>
      <View className="flex-1" style={themeStyles.screenBackground}>
        <ScrollView
          contentContainerClassName="px-xl pb-[140px] pt-lg"
          showsVerticalScrollIndicator={false}
          style={themeStyles.screenBackground}
        >
          <View className="mb-xxl flex-row items-center justify-between">
            <View className="flex-row items-center gap-md">
              <Pressable
                onPress={() =>
                  router.replace(
                    profile?.role === "instructor"
                      ? routes.instructor
                      : routes.student
                  )
                }
                className="h-10 w-10 items-center justify-center rounded-pill active:scale-[0.99] active:opacity-85"
              >
                <MaterialIcons
                  color={themeColors.primary}
                  name="arrow-back"
                  size={22}
                />
              </Pressable>

              <Text
                className="text-title font-extrabold"
                style={themeStyles.topBarTitle}
              >
                Profile
              </Text>
            </View>

            <Pressable className="h-10 w-10 items-center justify-center rounded-pill active:scale-[0.99] active:opacity-85">
              <MaterialIcons
                color={themeColors.primary}
                name="settings"
                size={22}
              />
            </Pressable>
          </View>

          <View className="mb-xxxl flex-row gap-xl">
            <View className="relative">
              <View
                className="h-32 w-32 items-center justify-center overflow-hidden rounded-xl border-4"
                style={themeStyles.portraitCard}
              >
                <Text
                  className="text-[42px] font-black"
                  style={themeStyles.portraitInitials}
                >
                  {initials}
                </Text>
              </View>
            </View>

            <View className="flex-1 justify-end pb-sm">
              <Text
                className="text-[32px] font-black leading-[38px]"
                style={themeStyles.heroTitle}
              >
                {displayName}
              </Text>
              <Text
                className="mt-xs text-bodyLg font-medium"
                style={themeStyles.heroSubtitle}
              >
                {role === "instructor" && profile?.universityNumber
                  ? `University No. ${profile.universityNumber}`
                  : email}
              </Text>
            </View>
          </View>

          <View
            className={[
              "flex-row gap-lg",
              role !== "instructor" ? "mb-xxxl" : "mb-xl",
            ].join(" ")}
          >
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                tone={stat.tone}
                value={stat.value}
              />
            ))}
          </View>

          {role === "instructor" ? (
            <View
              className="mb-xxxl flex-row items-center gap-xs self-start rounded-pill px-md py-[7px]"
              style={themeStyles.liveSummary}
            >
              <MaterialIcons
                color={themeColors.success}
                name="wifi-tethering"
                size={18}
              />
              <Text
                className="text-label font-extrabold"
                style={themeStyles.liveSummaryText}
              >
                {liveLectureCount} live lecture
                {liveLectureCount === 1 ? "" : "s"} right now
              </Text>
            </View>
          ) : null}

          <View className="mb-xxl">
            <Text
              className="mb-md px-sm text-[11px] font-extrabold uppercase tracking-[2px]"
              style={themeStyles.sectionLabel}
            >
              Account Settings
            </Text>
            <View
              className="overflow-hidden rounded-xl border"
              style={themeStyles.groupCard}
            >
              {accountRows.map((row, index) => (
                <SettingsButton
                  key={row.id}
                  hasDivider={index !== accountRows.length - 1}
                  onPress={
                    row.id === "personal-info"
                      ? openPersonalInfoModal
                      : undefined
                  }
                  row={row}
                />
              ))}
            </View>
          </View>

          <View className="mb-xxl">
            <Text
              className="mb-md px-sm text-[11px] font-extrabold uppercase tracking-[2px]"
              style={themeStyles.sectionLabel}
            >
              App Configuration
            </Text>
            <View
              className="overflow-hidden rounded-xl border"
              style={themeStyles.groupCard}
            >
              <SettingsButton hasDivider row={appRows[0]} />

              <View
                className="flex-row items-center justify-between border-b px-[20px] py-[18px]"
                style={themeStyles.inlineRow}
              >
                <View className="flex-row items-center gap-md">
                  <View
                    className="h-9 w-9 items-center justify-center rounded-[12px]"
                    style={themeStyles.paletteIconShell}
                  >
                    <MaterialIcons
                      color={themeColors.secondary}
                      name="palette"
                      size={20}
                    />
                  </View>
                  <Text
                    className="text-bodyLg font-medium"
                    style={themeStyles.rowLabel}
                  >
                    Appearance
                  </Text>
                </View>

                <View
                  className="flex-row items-center gap-[4px] rounded-pill p-[4px]"
                  style={themeStyles.appearanceSwitch}
                >
                  <Pressable
                    onPress={() => setThemePreference("system")}
                    className="h-[30px] w-[30px] items-center justify-center rounded-pill active:scale-[0.99] active:opacity-85"
                    style={
                      themePreference === "system"
                        ? themeStyles.appearanceOptionActive
                        : undefined
                    }
                  >
                    <MaterialIcons
                      color={
                        themePreference === "system"
                          ? themeColors.primary
                          : themeColors.onSurfaceVariant
                      }
                      name="brightness-auto"
                      size={16}
                    />
                  </Pressable>

                  <Pressable
                    onPress={() => setThemePreference("light")}
                    className="h-[30px] w-[30px] items-center justify-center rounded-pill active:scale-[0.99] active:opacity-85"
                    style={
                      themePreference === "light"
                        ? themeStyles.appearanceOptionActive
                        : undefined
                    }
                  >
                    <MaterialIcons
                      color={
                        themePreference === "light"
                          ? themeColors.primary
                          : themeColors.onSurfaceVariant
                      }
                      name="light-mode"
                      size={16}
                    />
                  </Pressable>

                  <Pressable
                    onPress={() => setThemePreference("dark")}
                    className="h-[30px] w-[30px] items-center justify-center rounded-pill active:scale-[0.99] active:opacity-85"
                    style={
                      themePreference === "dark"
                        ? themeStyles.appearanceOptionActive
                        : undefined
                    }
                  >
                    <MaterialIcons
                      color={
                        themePreference === "dark"
                          ? themeColors.primary
                          : themeColors.onSurfaceVariant
                      }
                      name="dark-mode"
                      size={16}
                    />
                  </Pressable>
                </View>
              </View>

              <SettingsButton row={appRows[1]} />
            </View>
          </View>

          <View className="pt-sm">
            <Pressable
              disabled={isSigningOut}
              onPress={handleLogout}
              className={[
                "min-h-[56px] flex-row items-center justify-center gap-sm rounded-xl active:scale-[0.99] active:opacity-85",
                isSigningOut ? "opacity-55" : "",
              ].join(" ")}
              style={{ backgroundColor: themeColors.dangerSoft }}
            >
              <MaterialIcons
                color={themeColors.error}
                name="logout"
                size={20}
              />
              <Text
                className="text-bodyLg font-extrabold"
                style={{ color: themeColors.error }}
              >
                {isSigningOut ? "Logging out..." : "Logout"}
              </Text>
            </Pressable>

            <Text
              className="mt-xl text-center text-[11px] font-bold uppercase tracking-[2px]"
              style={themeStyles.versionText}
            >
              Smart Campus v{appVersion}
            </Text>
          </View>
        </ScrollView>

        <PersonalInfoModal
          displayName={draftDisplayName}
          email={email}
          error={profileError}
          isInstructor={role === "instructor"}
          isSaving={isSavingProfile}
          onChangeDisplayName={setDraftDisplayName}
          onClose={closePersonalInfoModal}
          onSave={handleSavePersonalInfo}
          roleLabel={roleLabel}
          universityNumber={profile?.universityNumber}
          visible={personalInfoVisible}
        />
      </View>
    </ScreenShell>
  );
}

function buildAppRows(themeColors: AppColorTokens): SettingsRow[] {
  return [
    {
      icon: "language",
      iconBackground: withAlpha(themeColors.secondary, 0.08),
      iconColor: themeColors.secondary,
      id: "language",
      label: "Language",
      value: "English",
    },
    {
      icon: "help",
      iconBackground: withAlpha(themeColors.secondary, 0.08),
      iconColor: themeColors.secondary,
      id: "help-support",
      label: "Help & Support",
    },
  ];
}

function buildAccountRows({
  isEmailVerified,
  roleLabel,
  themeColors,
}: {
  isEmailVerified: boolean;
  roleLabel: string;
  themeColors: AppColorTokens;
}): SettingsRow[] {
  return [
    {
      icon: "person",
      iconBackground: withAlpha(themeColors.primary, 0.08),
      iconColor: themeColors.primary,
      id: "personal-info",
      label: "Personal Information",
      value: "Edit",
    },
    {
      icon: "lock",
      iconBackground: withAlpha(themeColors.primary, 0.08),
      iconColor: themeColors.primary,
      id: "security-password",
      label: "Security & Password",
    },
    {
      icon: "notifications",
      iconBackground: withAlpha(themeColors.primary, 0.08),
      iconColor: themeColors.primary,
      id: "notifications",
      label: "Notifications",
    },
    {
      icon: "badge",
      iconBackground: withAlpha(themeColors.primary, 0.08),
      iconColor: themeColors.primary,
      id: "role",
      label: "Role",
      value: roleLabel,
    },
    {
      icon: isEmailVerified ? "verified-user" : "report-gmailerrorred",
      iconBackground: withAlpha(themeColors.primary, 0.08),
      iconColor: isEmailVerified ? themeColors.success : themeColors.error,
      id: "email-status",
      label: "Email Status",
      value: isEmailVerified ? "Verified" : "Not verified",
    },
  ];
}

function StatCard({
  icon,
  label,
  tone,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  tone: "primary" | "secondary" | "tertiary";
  value: string;
}) {
  const { colors: themeColors } = useAppTheme();
  const themeStyles = createProfileThemeStyles(themeColors);
  const iconColor =
    tone === "primary"
      ? themeColors.primary
      : tone === "secondary"
        ? themeColors.secondary
        : themeColors.tertiary;
  const cardThemeStyle =
    tone === "tertiary" ? themeStyles.statCardTertiary : themeStyles.statCard;

  return (
    <View
      className="min-h-[116px] flex-1 gap-lg rounded-xl border p-[20px]"
      style={cardThemeStyle}
    >
      <MaterialIcons color={iconColor} name={icon} size={22} />
      <View>
        <Text
          className="mb-[2px] text-[30px] font-black"
          style={themeStyles.statValue}
        >
          {value}
        </Text>
        <Text
          className="text-micro font-bold uppercase tracking-[1.1px]"
          style={themeStyles.statCaption}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

function SettingsButton({
  hasDivider,
  onPress,
  row,
}: {
  hasDivider?: boolean;
  onPress?: () => void;
  row: SettingsRow;
}) {
  const { colors: themeColors } = useAppTheme();
  const themeStyles = createProfileThemeStyles(themeColors);

  return (
    <Pressable
      onPress={onPress}
      className={[
        "flex-row items-center justify-between gap-md px-[20px] py-[18px]",
        hasDivider ? "border-b" : "",
        onPress ? "active:scale-[0.99] active:opacity-85" : "",
      ].join(" ")}
      style={hasDivider ? themeStyles.rowDivider : undefined}
    >
      <View className="shrink-0 flex-row items-center gap-md">
        <View
          className="h-9 w-9 items-center justify-center rounded-[12px]"
          style={{ backgroundColor: row.iconBackground }}
        >
          <MaterialIcons color={row.iconColor} name={row.icon} size={20} />
        </View>
        <Text className="text-bodyLg font-medium" style={themeStyles.rowLabel}>
          {row.label}
        </Text>
      </View>

      <View className="flex-1 flex-row items-center justify-end gap-xs">
        {row.value ? (
          <Text
            className="shrink text-right text-body font-medium"
            style={themeStyles.rowValue}
          >
            {row.value}
          </Text>
        ) : null}
        {onPress ? (
          <MaterialIcons
            color={themeColors.outlineVariant}
            name="chevron-right"
            size={22}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

function PersonalInfoModal({
  displayName,
  email,
  error,
  isInstructor,
  isSaving,
  onChangeDisplayName,
  onClose,
  onSave,
  roleLabel,
  universityNumber,
  visible,
}: {
  displayName: string;
  email: string;
  error: string;
  isInstructor: boolean;
  isSaving: boolean;
  onChangeDisplayName: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  roleLabel: string;
  universityNumber?: string;
  visible: boolean;
}) {
  const { colors: themeColors } = useAppTheme();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View className="flex-1 justify-end">
        <Pressable
          disabled={isSaving}
          onPress={onClose}
          className="absolute inset-0 bg-[rgba(8,12,25,0.38)]"
        />

        <View className="gap-xl rounded-t-xl bg-surfaceLowest p-xl">
          <View className="mb-xl h-[5px] w-[54px] self-center rounded-pill bg-outlineVariant" />

          <View className="mb-xl flex-row items-center justify-between">
            <View>
              <Text className="text-micro font-extrabold uppercase tracking-[1px] text-tertiary">
                Profile
              </Text>
              <Text className="mt-[2px] text-headline font-extrabold text-onSurface">
                Personal Information
              </Text>
            </View>

            <Pressable
              disabled={isSaving}
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-pill active:scale-[0.99] active:opacity-85"
            >
              <MaterialIcons
                color={themeColors.onSurfaceVariant}
                name="close"
                size={22}
              />
            </Pressable>
          </View>

          <View className="gap-lg">
            <AppTextField
              autoCapitalize="words"
              label="Display Name"
              onChangeText={onChangeDisplayName}
              placeholder="Your name"
              rightAdornment={
                <MaterialIcons
                  color={themeColors.outline}
                  name="person"
                  size={20}
                />
              }
              value={displayName}
            />

            <View className="overflow-hidden rounded-xl bg-surfaceLow">
              <ReadOnlyInfoRow icon="email" label="Email" value={email} />
              <ReadOnlyInfoRow icon="badge" label="Role" value={roleLabel} />
              {isInstructor ? (
                <ReadOnlyInfoRow
                  icon="confirmation-number"
                  label="University Number"
                  value={universityNumber ?? "Not available"}
                />
              ) : null}
            </View>

            {error ? (
              <View className="flex-row items-center gap-sm rounded-md bg-error/10 px-md py-md">
                <MaterialIcons
                  color={themeColors.error}
                  name="error-outline"
                  size={18}
                />
                <Text className="flex-1 text-body font-bold text-error">
                  {error}
                </Text>
              </View>
            ) : null}
          </View>

          <View className="gap-sm">
            <AppButton
              disabled={isSaving}
              label={isSaving ? "Saving..." : "Save Changes"}
              onPress={onSave}
              trailing={
                <MaterialIcons
                  color={themeColors.onPrimary}
                  name="check"
                  size={20}
                />
              }
            />

            <Pressable
              disabled={isSaving}
              onPress={onClose}
              className="min-h-[48px] items-center justify-center rounded-xl active:scale-[0.99] active:opacity-85"
            >
              <Text className="text-body font-extrabold text-primary">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ReadOnlyInfoRow({
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
    <View className="flex-row items-center justify-between gap-md border-b border-outlineVariant/30 px-md py-md">
      <View className="flex-row items-center gap-sm">
        <View className="h-8 w-8 items-center justify-center rounded-pill bg-primarySoft">
          <MaterialIcons color={themeColors.primary} name={icon} size={18} />
        </View>
        <Text className="text-body font-extrabold text-onSurface">{label}</Text>
      </View>

      <Text className="flex-1 text-right text-body font-bold text-onSurfaceVariant">
        {value}
      </Text>
    </View>
  );
}
