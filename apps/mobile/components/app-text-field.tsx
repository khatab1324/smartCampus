import { ReactNode } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

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
  const { colors } = useAppTheme();

  return (
    <View className="gap-[6px]">
      <View className="flex-row items-center justify-between">
        <Text className="ml-xs text-label font-extrabold uppercase tracking-[0.8px] text-onSurfaceVariant">
          {label}
        </Text>
        {labelAccessory}
      </View>
      <View className="min-h-[56px] flex-row items-center rounded-xl border border-outlineVariant/45 bg-surfaceLowest px-[18px]">
        <TextInput
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          editable={editable}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.outline}
          secureTextEntry={secureTextEntry}
          className="flex-1 py-lg text-bodyLg text-onSurface"
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
      <Text className="text-label font-extrabold text-primary">{label}</Text>
    </Pressable>
  );
}
