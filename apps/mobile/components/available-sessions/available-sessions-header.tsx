import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

type AvailableSessionsHeaderProps = {
  initials: string;
  onOpenMenu: () => void;
};

export function AvailableSessionsHeader({
  initials,
  onOpenMenu,
}: AvailableSessionsHeaderProps) {
  const { colors: themeColors } = useAppTheme();

  return (
    <View className="flex-row items-center justify-between border-b border-outlineVariant/35 bg-surfaceLowest/90 px-xl pb-md pt-lg">
      <View className="flex-row items-center gap-md">
        <Pressable
          onPress={onOpenMenu}
          className="h-10 w-10 items-center justify-center rounded-pill active:scale-[0.99] active:opacity-85">
          <MaterialIcons color={themeColors.primary} name="menu" size={22} />
        </Pressable>
        <Text className="text-title font-extrabold text-primary">Smart Attendance</Text>
      </View>

      <View className="h-8 w-8 items-center justify-center rounded-pill bg-surfaceHigh">
        <Text className="text-micro font-extrabold tracking-[0.6px] text-primary">
          {initials}
        </Text>
      </View>
    </View>
  );
}
