import { ReactNode } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { tokens } from '@/constants/tokens';

type AppTextFieldProps = {
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  label: string;
  labelAccessory?: ReactNode;
  onChangeText: (value: string) => void;
  placeholder: string;
  rightAdornment?: ReactNode;
  secureTextEntry?: boolean;
  value: string;
};

export function AppTextField({
  autoCapitalize = 'none',
  autoComplete,
  editable = true,
  keyboardType,
  label,
  labelAccessory,
  onChangeText,
  placeholder,
  rightAdornment,
  secureTextEntry,
  value,
}: AppTextFieldProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {labelAccessory}
      </View>
      <View style={styles.inputShell}>
        <TextInput
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          editable={editable}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={tokens.colors.outline}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          value={value}
        />
        {rightAdornment}
      </View>
    </View>
  );
}

export function InlineFieldLink({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable hitSlop={8} onPress={onPress}>
      <Text style={styles.inlineLink}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  inlineLink: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.label,
    fontWeight: '800',
    letterSpacing: -0.1,
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceLowest,
    borderColor: tokens.effects.fieldBorder,
    borderRadius: tokens.radii.xl,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: 18,
    ...tokens.shadows.soft,
  },
  input: {
    color: tokens.colors.onSurface,
    flex: 1,
    fontSize: tokens.typography.bodyLg,
    paddingVertical: 16,
  },
});
