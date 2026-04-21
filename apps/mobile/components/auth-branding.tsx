import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/constants/tokens';

export function AuthBranding() {
  return (
    <View style={styles.container}>
      <View style={styles.iconShell}>
        <View style={styles.iconGlow} />
        <MaterialIcons color={tokens.colors.onPrimary} name="school" size={30} />
      </View>
      <Text style={styles.title}>Smart Campus</Text>
      <Text style={styles.subtitle}>Enter your credentials to access the portal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xxxl,
  },
  iconShell: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.md,
    height: 64,
    justifyContent: 'center',
    marginBottom: tokens.spacing.xl,
    overflow: 'hidden',
    width: 64,
    ...tokens.shadows.floating,
  },
  iconGlow: {
    backgroundColor: tokens.effects.primaryGlow,
    borderRadius: tokens.radii.pill,
    height: 72,
    opacity: 0.65,
    position: 'absolute',
    right: -14,
    top: -14,
    width: 72,
  },
  title: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.display,
    fontWeight: '900',
    letterSpacing: -1.4,
    marginBottom: tokens.spacing.sm,
  },
  subtitle: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '500',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
