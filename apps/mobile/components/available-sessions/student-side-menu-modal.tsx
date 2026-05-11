import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { routes } from '@/navigation/routes';

type AppRoute = (typeof routes)[keyof typeof routes];

type StudentSideMenuModalProps = {
  onClose: () => void;
  onRoutePress: (route: AppRoute) => void;
  visible: boolean;
};

export function StudentSideMenuModal({
  onClose,
  onRoutePress,
  visible,
}: StudentSideMenuModalProps) {
  const { colors: themeColors } = useAppTheme();

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View className="flex-1 flex-row">
        <Pressable onPress={onClose} className="absolute inset-0 bg-[rgba(8,12,25,0.38)]" />

        <View className="h-full w-[300px] max-w-[86%] bg-surfaceLowest px-xl py-xxxl">
          <View className="mb-xxxl flex-row items-center justify-between">
            <View>
              <Text className="text-title font-extrabold text-onSurface">Smart Campus</Text>
              <Text className="mt-xs text-body font-semibold text-onSurfaceVariant">
                Student menu
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-pill bg-surfaceHigh active:scale-[0.99] active:opacity-85">
              <MaterialIcons color={themeColors.onSurfaceVariant} name="close" size={20} />
            </Pressable>
          </View>

          <View className="gap-md">
            <SideMenuItem icon="home" label="Home" onPress={() => onRoutePress(routes.student)} />
            <SideMenuItem
              icon="history"
              label="History"
              onPress={() => onRoutePress(routes.history)}
            />
            <SideMenuItem
              icon="person"
              label="Profile"
              onPress={() => onRoutePress(routes.profile)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SideMenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors: themeColors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      className="min-h-[56px] flex-row items-center gap-md rounded-xl bg-surfaceLow px-lg active:scale-[0.99] active:opacity-90">
      <View className="h-10 w-10 items-center justify-center rounded-pill bg-primaryFixed">
        <MaterialIcons color={themeColors.onPrimaryFixed} name={icon} size={20} />
      </View>
      <Text className="text-bodyLg font-extrabold text-onSurface">{label}</Text>
    </Pressable>
  );
}
