import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';

import { tokens } from '@/constants/tokens';
import { useAuth } from '@/hooks/use-auth';
import { routes } from '@/navigation/routes';

export default function IndexScreen() {
  const { authUser, isHydrating, profile } = useAuth();

  if (isHydrating) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={tokens.colors.primary} size="large" />
        <Text style={styles.label}>Connecting to Smart Campus...</Text>
      </View>
    );
  }

  if (authUser && profile) {
    return <Redirect href={profile.role === 'instructor' ? routes.instructor : routes.student} />;
  }

  return <Redirect href={routes.login} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
    flex: 1,
    gap: tokens.spacing.md,
    justifyContent: 'center',
  },
  label: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '600',
  },
});
