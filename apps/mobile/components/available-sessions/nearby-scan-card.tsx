import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

type NearbyScanCardProps = {
  isLocating: boolean;
  locationStatus: string;
  onRefresh: () => void;
};

export function NearbyScanCard({
  isLocating,
  locationStatus,
  onRefresh,
}: NearbyScanCardProps) {
  const { colors: themeColors } = useAppTheme();

  return (
    <View className="mb-lg min-h-[224px] overflow-hidden rounded-xl border border-primary/10 bg-surfaceLow p-xl">
      <View className="z-10">
        <Text className="text-label font-bold uppercase tracking-[0.8px] text-onSurfaceVariant">
          Scan Source
        </Text>
        <Text className="mt-xs text-headline font-extrabold text-onSurface">
          Nearby classroom scan
        </Text>

        <View className="mt-lg flex-row items-center gap-xs">
          <MaterialIcons color={themeColors.primary} name="my-location" size={16} />
          <Text className="text-body font-bold text-primary">{locationStatus}</Text>
        </View>
      </View>

      <Pressable
        onPress={onRefresh}
        className="z-10 mt-auto min-h-[52px] flex-row items-center justify-center gap-sm self-stretch rounded-xl border border-outlineVariant/30 bg-primaryFixed active:scale-[0.99] active:opacity-85">
        <MaterialIcons color={themeColors.secondary} name="refresh" size={18} />
        <Text className="text-body font-extrabold text-onPrimaryFixed">
          {isLocating ? 'Scanning...' : 'Scan Again'}
        </Text>
      </Pressable>

      <View className="absolute -bottom-[36px] -right-[36px] h-[160px] w-[160px] rounded-pill bg-primary/10" />
    </View>
  );
}
