import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { useAppTheme } from '@/hooks/use-app-theme';

type SessionKeyLauncherProps = {
  onPress: () => void;
};

export function SessionKeyLauncher({ onPress }: SessionKeyLauncherProps) {
  const { colors: themeColors } = useAppTheme();

  return (
    <View className="mb-xxxl rounded-xl bg-surfaceLowest p-lg">
      <AppButton
        label="Find Session"
        leading={<MaterialIcons color={themeColors.onPrimary} name="key" size={20} />}
        onPress={onPress}
        trailing={<MaterialIcons color={themeColors.onPrimary} name="chevron-right" size={20} />}
      />
    </View>
  );
}
