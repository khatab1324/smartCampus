import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

type AvailableSessionsSummaryProps = {
  isLocating: boolean;
  visibleCount: number;
};

export function AvailableSessionsSummary({
  isLocating,
  visibleCount,
}: AvailableSessionsSummaryProps) {
  const { colors: themeColors } = useAppTheme();

  return (
    <View className="mb-xxxl">
      <View className="mb-sm flex-row items-center justify-between">
        <View className="flex-row items-center gap-sm">
          <View className="h-[10px] w-[10px] rounded-pill bg-tertiary" />
          <Text className="text-label font-extrabold uppercase tracking-[1px] text-tertiary">
            {isLocating ? 'Scanning' : 'Ready'}
          </Text>
        </View>

        <View className="flex-row items-center gap-xs rounded-pill bg-surfaceHigh px-md py-[6px]">
          <MaterialIcons color={themeColors.onSurfaceVariant} name="wifi-tethering" size={14} />
          <Text className="text-micro font-extrabold uppercase tracking-[0.7px] text-onSurfaceVariant">
            Found {visibleCount}
          </Text>
        </View>
      </View>

      <Text className="mb-sm text-display font-black leading-[48px] text-onSurface">
        Available Sessions
      </Text>
    </View>
  );
}
