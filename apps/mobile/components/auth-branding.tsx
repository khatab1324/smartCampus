import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

export function AuthBranding() {
  const { colors } = useAppTheme();

  return (
    <View className="mb-xxxl items-center">
      <View className="mb-xl h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-md bg-primary">
        <View className="absolute -right-[14px] -top-[14px] h-[72px] w-[72px] rounded-pill bg-primaryContainer opacity-65" />
        <MaterialIcons color={colors.onPrimary} name="school" size={30} />
      </View>
      <Text className="mb-sm text-display font-black text-onSurface">
        Smart Campus
      </Text>
    </View>
  );
}
