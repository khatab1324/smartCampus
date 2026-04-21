import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/constants/tokens';
import { AuthRole } from '@/types/auth';

type RoleSwitchProps = {
  onChange: (role: AuthRole) => void;
  value: AuthRole;
};

export function RoleSwitch({ onChange, value }: RoleSwitchProps) {
  return (
    <View style={styles.container}>
      <RoleOption active={value === 'student'} label="Student" onPress={() => onChange('student')} />
      <RoleOption
        active={value === 'instructor'}
        label="Instructor"
        onPress={() => onChange('instructor')}
      />
    </View>
  );
}

function RoleOption({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        active && styles.optionActive,
        pressed && !active && styles.optionPressed,
      ]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    gap: 6,
    padding: 6,
  },
  option: {
    alignItems: 'center',
    borderRadius: tokens.radii.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  optionActive: {
    backgroundColor: tokens.colors.surfaceLowest,
    shadowColor: tokens.colors.onSurface,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  optionPressed: {
    opacity: 0.75,
  },
  label: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '600',
  },
  labelActive: {
    color: tokens.colors.primary,
  },
});
