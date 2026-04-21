import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/constants/tokens';

type AppButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function AppButton({
  disabled = false,
  label,
  onPress,
  variant = 'primary',
  leading,
  trailing,
}: AppButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        disabled ? styles.disabled : pressed && styles.pressed,
      ]}>
      {isPrimary ? <View style={styles.primaryGlow} /> : null}
      {leading}
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>
        {label}
      </Text>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    justifyContent: 'center',
    minHeight: 56,
    overflow: 'hidden',
    paddingHorizontal: tokens.spacing.xl,
  },
  primary: {
    backgroundColor: tokens.colors.primary,
    ...tokens.shadows.floating,
  },
  secondary: {
    backgroundColor: tokens.colors.primaryFixed,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.55,
  },
  primaryGlow: {
    backgroundColor: tokens.effects.primaryGlow,
    borderRadius: 160,
    height: 160,
    position: 'absolute',
    right: -38,
    top: -58,
    width: 160,
  },
  label: {
    fontSize: tokens.typography.bodyLg,
    fontWeight: '800',
  },
  primaryLabel: {
    color: tokens.colors.onPrimary,
  },
  secondaryLabel: {
    color: tokens.colors.onPrimaryFixed,
  },
});
