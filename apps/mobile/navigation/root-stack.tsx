import { Stack } from 'expo-router';

import { useAppTheme } from '@/hooks/use-app-theme';
import { AppProviders } from '@/providers/app-providers';

export default function RootStack() {
  return (
    <AppProviders>
      <ThemedRootStack />
    </AppProviders>
  );
}

function ThemedRootStack() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="instructor" options={{ headerShown: false }} />
      <Stack.Screen name="create-lecture" options={{ headerShown: false }} />
      <Stack.Screen name="live-attendance" options={{ headerShown: false }} />
      <Stack.Screen name="available-sessions" options={{ headerShown: false }} />
      <Stack.Screen name="session-information" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(instructor-tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
