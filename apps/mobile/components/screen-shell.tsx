import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tokens } from '@/constants/tokens';

type ScreenShellProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function ScreenShell({ children, style }: ScreenShellProps) {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: tokens.colors.background,
    flex: 1,
  },
  content: {
    backgroundColor: tokens.colors.background,
    flex: 1,
  },
});
