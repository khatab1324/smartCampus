import { ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { navigationTheme, tokens } from '@/constants/tokens';
import { AuthProvider } from '@/providers/auth-provider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider value={navigationTheme}>
          {children}
          <StatusBar backgroundColor={tokens.colors.background} style="dark" />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
