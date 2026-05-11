import { PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/use-app-theme';

type ScreenShellProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function ScreenShell({ children, style }: ScreenShellProps) {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className="flex-1"
      style={{ backgroundColor: colors.background }}>
      <View className="flex-1" style={[{ backgroundColor: colors.background }, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}
