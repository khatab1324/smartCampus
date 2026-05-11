import { ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { vars } from 'nativewind';
import { PropsWithChildren, useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getNavigationTheme, getThemeNativeWindVariables } from '@/constants/tokens';
import { useAppTheme } from '@/hooks/use-app-theme';
import { AppThemeProvider } from '@/providers/app-theme-provider';
import { AuthProvider } from '@/providers/auth-provider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <ThemedAppProviders>{children}</ThemedAppProviders>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedAppProviders({ children }: PropsWithChildren) {
  const { colorScheme, colors } = useAppTheme();
  const nativeWindTheme = useMemo(() => vars(getThemeNativeWindVariables(colors)), [colors]);

  return (
    <AuthProvider>
      <ThemeProvider value={getNavigationTheme(colors)}>
        <View className="flex-1" style={nativeWindTheme}>
          {children}
          <StatusBar backgroundColor={colors.background} style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </View>
      </ThemeProvider>
    </AuthProvider>
  );
}
