import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { tokens } from '@/constants/tokens';
import { AppProviders } from '@/providers/app-providers';

export default function RootStack() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: tokens.colors.background },
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
      </Stack>
    </AppProviders>
  );
}
