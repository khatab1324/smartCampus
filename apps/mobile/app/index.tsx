import { ActivityIndicator, Text, View } from 'react-native';
import { Redirect } from 'expo-router';

import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { routes } from '@/navigation/routes';

export default function IndexScreen() {
  const { colors } = useAppTheme();
  const { authUser, isHydrating, profile } = useAuth();

  if (isHydrating) {
    return (
      <View className="flex-1 items-center justify-center gap-md bg-background">
        <ActivityIndicator color={colors.primary} size="large" />
        <Text className="text-body font-semibold text-onSurfaceVariant">
          Connecting to Smart Campus...
        </Text>
      </View>
    );
  }

  if (authUser && profile) {
    return <Redirect href={profile.role === 'instructor' ? routes.instructor : routes.student} />;
  }

  return <Redirect href={routes.login} />;
}
